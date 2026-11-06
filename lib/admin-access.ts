import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "admin" | "manager";

export type AdminMember = {
  email: string;
  role: AdminRole;
  created_at: string;
};

export async function getSignedInUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return { user: data.user, email: data.user.email.toLowerCase() };
}

export async function getAdminMember(email: string): Promise<AdminMember | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_members")
    .select("email, role, created_at")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("Could not read the admin member record.", error.message);
    return null;
  }
  if (!data || !["owner", "admin", "manager"].includes(data.role)) return null;
  return data as AdminMember;
}

export async function getAdminMembers(): Promise<AdminMember[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_members")
    .select("email, role, created_at")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Could not load admin members.", error.message);
    return [];
  }
  return (data ?? []) as AdminMember[];
}
