"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InviteSessionBridge() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if ((type !== "invite" && type !== "recovery") || !accessToken || !refreshToken) return;

    // Remove the one-time credentials from the visible URL immediately.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    void fetch("/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ accessToken, refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Invite verification failed.");
        router.replace(type === "recovery" ? "/admin/reset-password" : "/admin/setup");
      })
      .catch(() => {
        setError("This secure account link could not be completed. Request a fresh link and try again.");
      });
  }, [router]);

  if (!error) return null;

  return (
    <div role="alert" className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-lg border border-red-200/30 bg-black p-4 text-sm text-red-100 shadow-2xl">
      {error}
    </div>
  );
}
