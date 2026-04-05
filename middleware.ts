import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import { rateLimit } from "./lib/rateLimit";

export function middleware(req: any) {
  const ip = req.ip || "global";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { message: "Too many requests" },
      { status: 429 }
    );
  }

  if (req.nextUrl.pathname.startsWith("/api/ai")) {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const valid = verifyToken(token);

    if (!valid) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}