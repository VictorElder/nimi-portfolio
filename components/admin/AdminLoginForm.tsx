"use client";

import { useActionState, useState } from "react";
import { requestPasswordResetAction, signInAction } from "@/app/admin/actions";

export default function AdminLoginForm({
  initialMessage,
  configured,
}: {
  initialMessage?: string;
  configured: boolean;
}) {
  const [state, action, pending] = useActionState(signInAction, {});
  const [resetState, resetAction, resetPending] = useActionState(requestPasswordResetAction, {});
  const [forgot, setForgot] = useState(false);

  if (!configured) {
    return (
      <p className="mt-7 border border-[#fdcc1e]/25 bg-[#fdcc1e]/[.06] p-4 text-sm leading-6 text-[#fdcc1e]/80">
        Admin sign-in is not connected yet. Follow the Supabase setup steps in the project README, then restart the dev server.
      </p>
    );
  }

  return (
    <>
      <form action={forgot ? resetAction : action} className="mt-8 space-y-5">
        {(state.error || initialMessage) && !forgot && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{state.error ?? initialMessage}</p>}
        {resetState.error && forgot && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{resetState.error}</p>}
        {resetState.message && forgot && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-900">{resetState.message}</p>}
        <label className="block space-y-2 text-sm">
          <span className="text-xs font-semibold text-black/65">Email</span>
          <input required autoComplete="username" name="email" type="email" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/30 focus:border-black/50 focus:ring-4 focus:ring-[#f5d86f]/35" placeholder="you@example.com" />
        </label>
        {!forgot && <label className="block space-y-2 text-sm">
          <span className="text-xs font-semibold text-black/65">Password</span>
          <input required autoComplete="current-password" name="password" type="password" className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black outline-none transition placeholder:text-black/30 focus:border-black/50 focus:ring-4 focus:ring-[#f5d86f]/35" placeholder="Your password" />
        </label>}
        <button disabled={pending || resetPending} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-wait disabled:opacity-60">
          {forgot ? resetPending ? "Sending link…" : "Email reset link" : pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <button type="button" onClick={() => setForgot(!forgot)} className="mt-4 text-sm font-medium text-black/65 underline decoration-black/25 underline-offset-4 hover:text-black">{forgot ? "Back to sign in" : "Forgot password?"}</button>
    </>
  );
}
