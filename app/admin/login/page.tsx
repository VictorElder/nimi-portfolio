import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminMember, getSignedInUser } from "@/lib/admin-access";
import { isAdminBackendConfigured } from "@/lib/supabase/config";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Admin sign in — Nimi" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (isAdminBackendConfigured()) {
    const access = await getSignedInUser();
    if (access && await getAdminMember(access.email)) redirect("/admin");
  }

  const params = await searchParams;
  const message = params.error === "invite"
    ? "That invitation link is missing, expired, or already used. Ask the site owner to check your invitation."
    : params.error === "unauthorized"
      ? "This account is not on the site’s invite list. Ask the owner to add your email."
    : undefined;

  return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f8f8f6] px-5 py-16 text-black">
      <div className="w-full max-w-md rounded-3xl border border-black/[.08] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">Nimi · Private workspace</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.06em]">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-black/60">
          Sign in with the email address that received your invitation. New accounts can only be created from an invite.
        </p>
        <AdminLoginForm initialMessage={message} configured={isAdminBackendConfigured()} />
        <Link href="/designs" className="mt-8 inline-flex text-xs font-semibold text-black/50 transition hover:text-black">
          ← Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
