"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Project } from "@/data/projects";
import { deleteDesignAction, inviteMemberAction, saveDesignAction, signOutAction } from "@/app/admin/actions";
import type { AdminMember, AdminRole } from "@/lib/admin-access";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

type AdminProject = Project & { isPublished: boolean };
type Section = "overview" | "upload" | "designs" | "team" | "account";
const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "upload", label: "Upload work", icon: "＋" },
  { id: "designs", label: "Manage designs", icon: "▦" },
  { id: "team", label: "Team access", icon: "♙" },
  { id: "account", label: "Account settings", icon: "⚙" },
];

export default function AdminDashboard({
  email, role, projects, members,
}: { email: string; role: AdminRole; projects: AdminProject[]; members: AdminMember[] }) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const canInvite = role === "owner" || role === "admin";

  function navigate(next: Section) {
    setSection(next);
    setSidebarOpen(false);
    setNotice(null);
    if (next !== "upload") setEditing(null);
  }

  async function saveProject(formData: FormData) {
    setBusy(true);
    const result = await saveDesignAction(formData);
    setBusy(false);
    setNotice({ message: result.error ?? result.message ?? "Saved.", error: Boolean(result.error) });
    if (!result.error) { setEditing(null); router.refresh(); }
  }

  async function deleteProject(formData: FormData) {
    if (!window.confirm("Delete this design and its uploaded image? This cannot be undone.")) return;
    setBusy(true);
    const result = await deleteDesignAction(formData);
    setBusy(false);
    setNotice({ message: result.error ?? result.message ?? "Design deleted.", error: Boolean(result.error) });
    if (!result.error) router.refresh();
  }

  async function inviteMember(formData: FormData) {
    setBusy(true);
    const result = await inviteMemberAction(formData);
    setBusy(false);
    setNotice({ message: result.error ?? result.message ?? "Invitation sent.", error: Boolean(result.error) });
    if (!result.error) router.refresh();
  }

  const title = navItems.find((item) => item.id === section)?.label ?? "Overview";

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-[#171717]">
      {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/35 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-[#f5d86f] px-5 py-6 shadow-[12px_0_36px_rgba(0,0,0,.06)] transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-black text-lg font-bold text-[#f5d86f]">N</span><div><p className="text-sm font-semibold tracking-tight">Nimi Studio</p><p className="mt-0.5 text-[11px] text-black/55">Portfolio workspace</p></div></div>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-xl lg:hidden">×</button>
        </div>
        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.19em] text-black/45">Workspace</p>
        <nav className="space-y-1" aria-label="Admin sections">
          {navItems.filter((item) => item.id !== "team" || canInvite).map((item) => <button key={item.id} onClick={() => navigate(item.id)} className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-all duration-200 ${section === item.id ? "translate-x-1 bg-black text-white shadow-md" : "text-black/70 hover:translate-x-1 hover:bg-black/[.06] hover:text-black"}`}><span className={`grid size-8 place-items-center rounded-lg text-lg ${section === item.id ? "bg-white/10" : "bg-black/[.05]"}`}>{item.icon}</span><span className="font-medium">{item.label}</span>{item.id === "designs" && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${section === item.id ? "bg-white/15" : "bg-black/[.07]"}`}>{projects.length}</span>}</button>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-black/10 bg-white/35 p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-black/45">Signed in as</p><p className="mt-2 truncate text-xs font-medium">{email}</p><span className="mt-2 inline-flex rounded-full bg-black/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em]">{role}</span></div>
        <form action={signOutAction} className="mt-3"><button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-black/70 transition hover:bg-black hover:text-white"><span className="grid size-8 place-items-center text-lg">↪</span>Sign out</button></form>
      </aside>

      <div className="min-h-screen lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-black/[.08] bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="grid size-10 place-items-center rounded-xl border border-black/10 text-xl transition hover:bg-black/[.04] lg:hidden">☰</button><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-black/40">Studio / {title}</p><h1 className="mt-0.5 text-lg font-semibold tracking-tight">{section === "upload" && editing ? "Edit design" : title}</h1></div></div>
          <Link href="/designs" target="_blank" className="rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold transition hover:border-black/25 hover:bg-black/[.03] sm:px-4">View portfolio <span aria-hidden="true">↗</span></Link>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {notice && <div className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm ${notice.error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`} role={notice.error ? "alert" : "status"}>{notice.message}<button onClick={() => setNotice(null)} aria-label="Dismiss message" className="text-lg leading-none opacity-60">×</button></div>}

          {section === "overview" && <Overview projects={projects} email={email} role={role} onNavigate={navigate} />}
          {section === "upload" && <UploadSection projects={projects} editing={editing} busy={busy} onSave={saveProject} onCancel={() => { setEditing(null); setNotice(null); }} />}
          {section === "designs" && <DesignSection projects={projects} busy={busy} onDelete={deleteProject} onEdit={(project) => { setEditing(project); setSection("upload"); setNotice(null); }} onCreate={() => { setEditing(null); setSection("upload"); setNotice(null); }} />}
          {section === "team" && canInvite && <TeamSection role={role} members={members} busy={busy} onInvite={inviteMember} />}
          {section === "account" && <AccountSection email={email} role={role} />}
        </main>
      </div>
    </div>
  );
}

function Overview({ projects, email, role, onNavigate }: { projects: AdminProject[]; email: string; role: AdminRole; onNavigate: (section: Section) => void }) {
  return <div className="animate-admin-in">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm text-black/45">Good to see you,</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Your creative space.</h2><p className="mt-2 text-sm text-black/55">Manage the portfolio and keep everything up to date.</p></div><div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-black/55"><span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />{email}<span className="ml-2 text-black/30">·</span><span className="ml-2 font-semibold capitalize text-black/70">{role}</span></div></div>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="All designs" value={projects.length} detail="In your library" icon="▦" /><StatCard label="Published" value={projects.filter((p) => p.isPublished).length} detail="Visible on your site" icon="◉" /><StatCard label="Drafts" value={projects.filter((p) => !p.isPublished).length} detail="Only visible to admins" icon="◷" /></div>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_.8fr]"><section className="rounded-3xl border border-black/[.07] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">Latest work</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Design library</h3></div><button onClick={() => onNavigate("designs")} className="text-xs font-semibold text-black/55 hover:text-black">View all →</button></div>{projects.length ? <div className="mt-5 divide-y divide-black/[.07]">{projects.slice(0, 4).map((p) => <ProjectRow key={p.id ?? p.title} project={p} />)}</div> : <EmptyState title="Your library is ready" body="Upload your first project to get started." action="Upload a design" onClick={() => onNavigate("upload")} />}</section><section className="rounded-3xl bg-[#171717] p-6 text-white sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/40">Quick actions</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">What would you like to do?</h3><div className="mt-6 space-y-3"><ActionTile title="Add new work" detail="Upload an image and project details" icon="＋" onClick={() => onNavigate("upload")} /><ActionTile title="Manage designs" detail="Edit, publish, or remove projects" icon="▦" onClick={() => onNavigate("designs")} />{(role === "owner" || role === "admin") && <ActionTile title="Invite your team" detail="Give a teammate secure access" icon="♙" onClick={() => onNavigate("team")} />}</div></section></div>
  </div>;
}

function UploadSection({ projects, editing, busy, onSave, onCancel }: { projects: AdminProject[]; editing: AdminProject | null; busy: boolean; onSave: (formData: FormData) => Promise<void>; onCancel: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => { setFile(null); }, [editing?.id]);
  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  return <div className="animate-admin-in mx-auto max-w-5xl">
    <div className="mb-7"><p className="text-sm text-black/45">Portfolio content</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em]">{editing ? "Refine your design" : "Add a new design"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-black/55">Give your project room to shine. Choose an image first to preview it, then add the details before saving.</p></div>
    <form key={editing?.id ?? "new"} action={onSave} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-3xl border border-black/[.08] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">01 · Artwork</p><h3 className="mt-1 text-lg font-semibold">Image preview</h3></div><span className="rounded-full bg-black/[.04] px-3 py-1 text-[10px] text-black/50">JPG · PNG · WebP</span></div>
        <label className="group mt-5 flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/15 bg-[#fafaf8] text-center transition hover:border-black/35 hover:bg-[#f5f5f2]">
          {preview || editing?.image ? <><img src={preview ?? editing?.image} alt="Preview of selected design" className="max-h-[420px] w-full flex-1 object-contain p-3" /><span className="mx-4 mb-4 rounded-xl bg-white px-4 py-2 text-xs font-semibold shadow-sm">{file ? "Choose a different image" : "Browse to replace image"}</span></> : <><span className="grid size-14 place-items-center rounded-2xl bg-[#f5d86f]/45 text-2xl transition group-hover:scale-105">↑</span><span className="mt-4 text-sm font-semibold">Drop your image here</span><span className="mt-1 text-xs text-black/45">or click to browse your files</span><span className="mt-4 text-[10px] text-black/35">Maximum file size 8 MB</span></>}
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required={!editing} className="sr-only" onChange={(event) => setFile(event.currentTarget.files?.[0] ?? null)} />
        </label><p className="mt-3 text-xs leading-5 text-black/45">{file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB. Preview only — it uploads when you save.` : "The selected image stays on this device until you save the design."}</p>
      </section>
      <section className="rounded-3xl border border-black/[.08] bg-white p-5 shadow-sm sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">02 · Project details</p><h3 className="mt-1 text-lg font-semibold">Tell the story</h3>{editing?.id && <input type="hidden" name="id" value={editing.id} />}
        <div className="mt-5 space-y-5"><FormField label="Project name"><input required minLength={2} maxLength={100} name="title" defaultValue={editing?.title} placeholder="e.g. Rare Bites" /></FormField><FormField label="Category"><input required minLength={2} maxLength={100} name="type" defaultValue={editing?.type} placeholder="e.g. Brand identity" /></FormField><FormField label="Project notes"><textarea required minLength={10} maxLength={1200} rows={5} name="description" defaultValue={editing?.description} placeholder="Describe the concept, audience, and visual direction…" /></FormField><FormField label="Display order"><input required min={0} max={10000} type="number" name="sortOrder" defaultValue={editing ? editing.sortOrder ?? projects.findIndex((p) => p.id === editing.id) : projects.length} /></FormField>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/[.08] bg-[#fafaf8] p-4"><input type="checkbox" name="isPublished" defaultChecked={editing?.isPublished ?? true} className="mt-0.5 size-4 accent-black" /><span><span className="block text-sm font-semibold">Publish on portfolio</span><span className="mt-1 block text-xs text-black/50">Turn off to save this as a private draft.</span></span></label>
          <div className="flex flex-wrap gap-3 border-t border-black/[.07] pt-5"><button disabled={busy} className="min-h-12 flex-1 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50">{busy ? "Saving…" : editing ? "Save changes" : "Save and publish design"}</button>{editing && <button type="button" onClick={onCancel} className="min-h-12 rounded-xl border border-black/10 px-5 text-sm font-semibold transition hover:bg-black/[.04]">Cancel</button>}</div>
        </div>
      </section>
    </form>
  </div>;
}

function DesignSection({ projects, busy, onDelete, onEdit, onCreate }: { projects: AdminProject[]; busy: boolean; onDelete: (data: FormData) => Promise<void>; onEdit: (p: AdminProject) => void; onCreate: () => void }) {
  return <div className="animate-admin-in"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-black/45">Your portfolio content</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em]">Manage designs</h2><p className="mt-2 text-sm text-black/55">Edit project details, control what is public, or remove old work.</p></div><button onClick={onCreate} className="min-h-11 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80">＋ Add design</button></div>
    {projects.length ? <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{projects.map((project) => <article key={project.id ?? project.title} className="overflow-hidden rounded-3xl border border-black/[.08] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative aspect-[16/10] bg-[#f1f1ee]"><img src={project.image} alt={project.title} loading="lazy" className="size-full object-contain p-2" /><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold ${project.isPublished ? "bg-white text-emerald-800" : "bg-black/75 text-white"}`}>{project.isPublished ? "Published" : "Draft"}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-semibold tracking-tight">{project.title}</h3><p className="mt-1 truncate text-xs text-black/45">{project.type}</p></div><span className="shrink-0 rounded-lg bg-black/[.04] px-2.5 py-1.5 text-[10px] text-black/50">Order {project.sortOrder ?? 0}</span></div><p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-black/55">{project.description}</p><div className="mt-5 flex gap-2 border-t border-black/[.07] pt-4"><button onClick={() => onEdit(project)} className="min-h-10 flex-1 rounded-xl border border-black/10 text-xs font-semibold transition hover:bg-black/[.04]">Edit details</button>{project.id && <form action={onDelete}><input type="hidden" name="id" value={project.id} /><button disabled={busy} className="min-h-10 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50">Delete</button></form>}</div></div></article>)}</div> : <div className="rounded-3xl border border-black/[.08] bg-white p-10"><EmptyState title="No designs yet" body="Upload a project and it will appear here for editing and publishing." action="Upload your first design" onClick={onCreate} /></div>}
  </div>;
}

function TeamSection({ role, members, busy, onInvite }: { role: AdminRole; members: AdminMember[]; busy: boolean; onInvite: (data: FormData) => Promise<void> }) {
  return <div className="animate-admin-in mx-auto max-w-6xl"><div className="mb-7"><p className="text-sm text-black/45">Workspace permissions</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em]">Team access</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">Invite trusted people by email. There is no public account creation; only people on the access list can enter this dashboard.</p></div><div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><section className="rounded-3xl border border-black/[.08] bg-white p-5 shadow-sm sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">Invite a teammate</p><h3 className="mt-1 text-xl font-semibold">Add someone to the studio</h3><p className="mt-2 text-sm leading-6 text-black/50">They’ll receive a setup link to choose their password.</p><form action={onInvite} className="mt-6 space-y-5"><FormField label="Email address"><input required name="email" type="email" placeholder="manager@example.com" /></FormField><FormField label="Access level"><select name="role" defaultValue="manager">{role === "owner" && <option value="admin">Admin · can invite managers</option>}<option value="manager">Manager · can manage designs</option></select></FormField><button disabled={busy} className="min-h-12 w-full rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50">{busy ? "Sending invitation…" : "Send invitation"}</button></form><div className="mt-5 rounded-xl bg-[#fff8dd] p-3 text-xs leading-5 text-black/60">Supabase’s built-in email service may only send to organization members. If an invite is rejected, configure custom SMTP in Supabase Auth.</div></section><section className="rounded-3xl border border-black/[.08] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">Access list</p><h3 className="mt-1 text-xl font-semibold">People with access</h3></div><span className="rounded-full bg-black/[.05] px-3 py-1 text-xs font-semibold">{members.length} members</span></div><div className="mt-5 divide-y divide-black/[.07]">{members.map((member, index) => <div key={member.email} className="flex items-center gap-3 py-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f5d86f]/50 text-sm font-bold">{member.email.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{member.email}</p><p className="mt-1 text-xs text-black/40">{index === 0 ? "Workspace member" : "Added to workspace"}</p></div><span className="rounded-full bg-black/[.05] px-3 py-1 text-[10px] font-semibold capitalize">{member.role}</span></div>)}</div><div className="mt-5 border-t border-black/[.07] pt-4 text-xs leading-5 text-black/45">Only the owner can grant Admin access. Admins can invite managers. Managers can edit and publish designs.</div></section></div></div>;
}

function AccountSection({ email, role }: { email: string; role: AdminRole }) {
  return <div className="animate-admin-in mx-auto max-w-3xl"><div className="mb-7"><p className="text-sm text-black/45">Personal preferences</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em]">Account settings</h2><p className="mt-2 text-sm text-black/55">Update your password and check your workspace access.</p></div><div className="grid gap-5"><section className="rounded-3xl border border-black/[.08] bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">Signed-in account</p><p className="mt-3 text-lg font-semibold">{email}</p><span className="mt-2 inline-flex rounded-full bg-[#f5d86f]/45 px-3 py-1 text-xs font-semibold capitalize">{role}</span></section><section className="rounded-3xl border border-black/[.08] bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.14em] text-black/40">Security</p><h3 className="mt-1 text-lg font-semibold">Change your password</h3><p className="mt-1 text-sm text-black/50">Choose at least 10 characters. You’ll stay signed in after saving.</p><SetPasswordForm /></section></div></div>;
}

function StatCard({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: string }) { return <div className="rounded-3xl border border-black/[.07] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><span className="text-xs font-semibold text-black/45">{label}</span><span className="grid size-9 place-items-center rounded-xl bg-[#f5d86f]/45 text-lg">{icon}</span></div><p className="mt-5 text-4xl font-semibold tracking-[-.06em]">{String(value).padStart(2, "0")}</p><p className="mt-1 text-xs text-black/40">{detail}</p></div>; }
function ProjectRow({ project }: { project: AdminProject }) { return <div className="flex items-center gap-3 py-3"><div className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#f1f1ee]"><img src={project.image} alt="" className="size-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{project.title}</p><p className="mt-0.5 truncate text-xs text-black/45">{project.type}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${project.isPublished ? "bg-emerald-50 text-emerald-800" : "bg-black/[.05] text-black/50"}`}>{project.isPublished ? "Live" : "Draft"}</span></div>; }
function ActionTile({ title, detail, icon, onClick }: { title: string; detail: string; icon: string; onClick: () => void }) { return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-3 text-left transition hover:translate-x-1 hover:bg-white/[.12]"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f5d86f] text-lg text-black">{icon}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block truncate text-xs text-white/45">{detail}</span></span><span className="text-white/35">→</span></button>; }
function EmptyState({ title, body, action, onClick }: { title: string; body: string; action: string; onClick: () => void }) { return <div className="py-10 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f5d86f]/40 text-xl">▦</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-black/50">{body}</p><button onClick={onClick} className="mt-5 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white">{action}</button></div>; }
function FormField({ label, children }: { label: string; children: ReactNode }) { return <label className="block space-y-2"><span className="block text-xs font-semibold text-black/65">{label}</span>{children}<style jsx>{`input:not([type="checkbox"]), textarea, select { box-sizing: border-box; width: 100%; border: 1px solid rgb(0 0 0 / .12); border-radius: .8rem; background: white; padding: .8rem .9rem; color: #171717; outline: none; transition: border-color .18s, box-shadow .18s; font-size: .875rem; } input:focus, textarea:focus, select:focus { border-color: rgb(0 0 0 / .5); box-shadow: 0 0 0 3px rgb(245 216 111 / .35); } input::placeholder, textarea::placeholder { color: rgb(0 0 0 / .33); }`}</style></label>; }
