import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: { accessToken?: unknown; refreshToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body.accessToken !== "string" ||
    typeof body.refreshToken !== "string" ||
    !body.accessToken ||
    !body.refreshToken
  ) {
    return NextResponse.json({ error: "Invite session is incomplete." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.setSession({
      access_token: body.accessToken,
      refresh_token: body.refreshToken,
    });
    if (error) return NextResponse.json({ error: "Invite session could not be verified." }, { status: 401 });

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Invite session could not be saved." }, { status: 500 });
  }
}
