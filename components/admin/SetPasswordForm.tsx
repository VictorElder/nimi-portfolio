"use client";

import { useActionState } from "react";
import { setPasswordAction } from "@/app/admin/actions";

export default function SetPasswordForm() {
  const [state, action, pending] = useActionState(setPasswordAction, {});

  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      <label className="block space-y-2 text-sm">
        <span className="text-xs font-semibold text-black/65">New password</span>
        <input required minLength={10} autoComplete="new-password" name="password" type="password" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black outline-none transition focus:border-black/50 focus:ring-4 focus:ring-[#f5d86f]/35" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-xs font-semibold text-black/65">Confirm password</span>
        <input required minLength={10} autoComplete="new-password" name="confirmation" type="password" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black outline-none transition focus:border-black/50 focus:ring-4 focus:ring-[#f5d86f]/35" />
      </label>
      <button disabled={pending} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-wait disabled:opacity-60">
        {pending ? "Saving…" : "Save password and continue"}
      </button>
    </form>
  );
}
