import { redirect } from "next/navigation";
import { getAdminMember, getSignedInUser } from "@/lib/admin-access";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

export const metadata = { title: "Change your password — Nimi" };

export default async function ResetPasswordPage() {
  const access = await getSignedInUser();
  if (!access || !(await getAdminMember(access.email))) redirect("/admin/login?error=invite");

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-16 text-black">
      <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">Nimi · Secure account</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-3 text-sm leading-6 text-black/60">The reset link is valid. Set a new password for {access.email}.</p>
        <SetPasswordForm />
      </div>
    </main>
  );
}
