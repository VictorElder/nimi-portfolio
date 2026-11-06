import { redirect } from "next/navigation";
import { getAdminMember, getSignedInUser } from "@/lib/admin-access";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

export const metadata = { title: "Set your password — Nimi" };
export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const access = await getSignedInUser();
  if (!access || !(await getAdminMember(access.email))) redirect("/admin/login");

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f8f8f6] px-5 py-16 text-black">
      <div className="w-full max-w-md rounded-3xl border border-black/[.08] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">Nimi · Welcome to the team</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.06em]">Set your password</h1>
        <p className="mt-3 text-sm leading-6 text-black/60">You’re signing in as {access.email}. Choose a password for future visits.</p>
        <SetPasswordForm />
      </div>
    </main>
  );
}
