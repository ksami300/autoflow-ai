import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { success, error } from "@/lib/apiResponse";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return error("Missing fields");
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    const token = signToken({ id: user.id });

    return success({ user, token });
  } catch (err) {
    return error("Server error", 500);
  }
}