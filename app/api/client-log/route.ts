import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.error(">>> [CLIENT-BROWSER-ERROR] >>>", JSON.stringify(body, null, 2));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
