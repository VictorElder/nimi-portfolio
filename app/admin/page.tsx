import Link from "next/link";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminMember, getAdminMembers, getSignedInUser } from "@/lib/admin-access";
import { getAdminProjects } from "@/lib/projects";
import { isAdminBackendConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Portfolio dashboard — Nimi" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminBackendConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-5 py-16 text-black">
        <div className="w-full max-w-3xl rounded-3xl border border-black/[.08] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">Private workspace / setup needed</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.06em]">Connect the admin backend</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-black/70">Add the Supabase project URL, publishable key, and server-only secret key to <code className="text-black">.env.local</code>, then run the SQL setup from the project README.</p>
          <p className="mt-4 text-sm leading-6 text-black/55">The site’s existing designs will remain visible until the database is connected.</p>
          <Link href="/admin/login" className="mt-7 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/80">Go to sign in</Link>
        </div>
      </main>
    );
  }

  const access = await getSignedInUser();
  if (!access) redirect("/admin/login");
  const member = await getAdminMember(access.email);
  if (!member) redirect("/admin/login?error=unauthorized");

  try {
    const projects = await getAdminProjects();
    const members = member.role === "manager" ? [] : await getAdminMembers();
    return <AdminDashboard email={access.email} role={member.role} projects={projects} members={members} />;
  } catch (error) {
    console.error("The admin dashboard could not load.", error);
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-5 py-16 text-black">
        <div className="w-full max-w-3xl rounded-3xl border border-black/[.08] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">One more setup step</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.06em]">Prepare the database</h1>
          <p className="mt-4 text-sm leading-6 text-black/65">The Supabase project is connected, but its portfolio tables are not ready yet. Run the SQL from the project README and refresh this page.</p>
          <Link href="/admin/login" className="mt-7 inline-flex rounded-xl border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[.04]">Back to sign in</Link>
        </div>
      </main>
    );
  }
}
