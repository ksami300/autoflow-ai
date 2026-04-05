import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { success, error } from "@/lib/apiResponse";
import { loginSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return error("Invalid input");

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error("Invalid credentials");

    const token = signToken({ id: user.id });

    return success({ user, token });
  } catch {
    return error("Server error", 500);
  }
}