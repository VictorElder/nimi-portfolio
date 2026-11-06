import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (!code && !(tokenHash && type === "invite")) {
    return NextResponse.redirect(new URL("/admin/login?error=invite", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: "invite" });
  const { error } = result;
  if (error) return NextResponse.redirect(new URL("/admin/login?error=invite", request.url));

  const requestedNext = request.nextUrl.searchParams.get("next");
  const next = requestedNext === "/admin/setup" || requestedNext === "/admin/reset-password" ? requestedNext : "/admin";
  return NextResponse.redirect(new URL(next, request.url));
}
