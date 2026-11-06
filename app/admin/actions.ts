"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminMember, type AdminRole } from "@/lib/admin-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; message?: string };

async function signedInMember() {
  const sessionClient = await createSupabaseServerClient();
  const { data, error } = await sessionClient.auth.getUser();
  const email = data.user?.email?.trim().toLowerCase();
  if (error || !email) return null;
  const member = await getAdminMember(email);
  return member ? { email, member, sessionClient } : null;
}

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your work email and password." };

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: "Those sign-in details could not be verified." };

    if (!(await getAdminMember(email))) {
      await supabase.auth.signOut();
      return { error: "This email has not been invited to manage the site." };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign-in is not configured yet." };
  }

  redirect("/admin");
}

export async function requestPasswordResetAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  try {
    const supabase = await createSupabaseServerClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: origin });
    if (error) throw error;
    return { message: "If this email belongs to an account, a password reset link will arrive shortly." };
  } catch (error) {
    console.error("Could not request a password reset.", error);
    return { error: "The reset email could not be sent. Check the address and Supabase email settings." };
  }
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function setPasswordAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 10) return { error: "Use at least 10 characters for your password." };
  if (password !== confirmation) return { error: "The passwords do not match." };

  const access = await signedInMember();
  if (!access) return { error: "Your invitation is not active. Ask an admin to send it again." };
  const { error } = await access.sessionClient.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/admin");
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveDesignAction(formData: FormData): Promise<ActionState> {
  const access = await signedInMember();
  if (!access) return { error: "Sign in with an invited manager account to edit designs." };

  const id = value(formData, "id");
  const title = value(formData, "title");
  const type = value(formData, "type");
  const description = value(formData, "description");
  const sortOrderValue = value(formData, "sortOrder");
  const sortOrder = sortOrderValue === "" ? 0 : Number(sortOrderValue);
  const imageFile = formData.get("image");
  const hasImage = imageFile instanceof File && imageFile.size > 0;

  if (title.length < 2 || title.length > 100) return { error: "Project name must be 2–100 characters." };
  if (type.length < 2 || type.length > 100) return { error: "Category must be 2–100 characters." };
  if (description.length < 10 || description.length > 1200) {
    return { error: "Project notes must be 10–1,200 characters." };
  }
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 10000) {
    return { error: "Order must be a whole number between 0 and 10,000." };
  }
  if (!id && !hasImage) return { error: "Choose a design image to upload." };
  if (id && !/^[0-9a-f-]{36}$/i.test(id)) return { error: "That project could not be found." };
  if (hasImage && imageFile instanceof File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { error: "Use a JPG, PNG, or WebP image." };
    }
    if (imageFile.size > 8 * 1024 * 1024) {
      return { error: "Images must be 8 MB or smaller." };
    }
  }

  try {
    const supabase = createSupabaseAdminClient();
    let existing: { image_url: string } | null = null;
    if (id) {
      const { data, error } = await supabase
        .from("design_projects")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return { error: "That project could not be found." };
      existing = data;
    }

    let imageUrl = existing?.image_url ?? "";
    let uploadedPath: string | null = null;
    if (hasImage && imageFile instanceof File) {
      const extension = imageFile.type === "image/jpeg" ? "jpg" : imageFile.type.slice("image/".length);
      uploadedPath = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-designs")
        .upload(uploadedPath, await imageFile.arrayBuffer(), {
          contentType: imageFile.type,
          cacheControl: "31536000",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      imageUrl = supabase.storage.from("portfolio-designs").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const record = {
      title,
      type,
      description,
      image_url: imageUrl,
      sort_order: sortOrder,
      is_published: formData.get("isPublished") === "on",
    };
    const { error: saveError } = id
      ? await supabase.from("design_projects").update(record).eq("id", id)
      : await supabase.from("design_projects").insert(record);
    if (saveError) {
      if (uploadedPath) await supabase.storage.from("portfolio-designs").remove([uploadedPath]);
      throw saveError;
    }

    if (uploadedPath && existing?.image_url) {
      const oldPath = existing.image_url.split("/portfolio-designs/")[1]?.split("?")[0];
      if (oldPath) await supabase.storage.from("portfolio-designs").remove([decodeURIComponent(oldPath)]);
    }
    revalidatePath("/designs");
    revalidatePath("/admin");
    return { message: id ? "Design updated." : "Design added to your portfolio." };
  } catch (error) {
    console.error("Could not save design project.", error);
    return { error: error instanceof Error ? error.message : "The design could not be saved." };
  }
}

export async function deleteDesignAction(formData: FormData): Promise<ActionState> {
  if (!(await signedInMember())) return { error: "Sign in with an invited manager account to edit designs." };
  const id = value(formData, "id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "That project could not be found." };

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error: readError } = await supabase
      .from("design_projects")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();
    if (readError) throw readError;
    if (!data) return { error: "That project could not be found." };

    const { error } = await supabase.from("design_projects").delete().eq("id", id);
    if (error) throw error;

    const path = data.image_url.split("/portfolio-designs/")[1]?.split("?")[0];
    if (path) await supabase.storage.from("portfolio-designs").remove([decodeURIComponent(path)]);
    revalidatePath("/designs");
    revalidatePath("/admin");
    return { message: "Design deleted." };
  } catch (error) {
    console.error("Could not delete design project.", error);
    return { error: error instanceof Error ? error.message : "The design could not be deleted." };
  }
}

export async function inviteMemberAction(formData: FormData): Promise<ActionState> {
  const access = await signedInMember();
  if (!access) return { error: "Sign in with an invited admin account to invite a teammate." };

  const email = value(formData, "email").toLowerCase();
  const roleValue = value(formData, "role");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (roleValue !== "admin" && roleValue !== "manager") return { error: "Choose an admin or manager role." };
  if (access.member.role !== "owner" && roleValue !== "manager") {
    return { error: "Only the owner can invite another admin." };
  }
  if (email === access.email) return { error: "You cannot invite your own email address." };

  try {
    const supabase = createSupabaseAdminClient();
    const { data: existing, error: lookupError } = await supabase
      .from("admin_members")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return { error: "That email already has access to the dashboard." };

    const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
    if (inviteError) throw inviteError;
    if (!data.user) throw new Error("The invitation could not be created.");

    const { error: insertError } = await supabase
      .from("admin_members")
      .insert({ email, role: roleValue as AdminRole });
    if (insertError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw insertError;
    }
    revalidatePath("/admin");
    return { message: `Invitation sent to ${email}.` };
  } catch (error) {
    console.error("Could not invite dashboard member.", error);
    return {
      error: error instanceof Error
        ? error.message
        : "The invitation could not be sent. Check the email and Supabase Auth email settings.",
    };
  }
}
