import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";
import { aiSchema } from "@/lib/validators";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userData: any = verifyToken(token!);

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user || user.plan !== "PRO") {
      return error("Upgrade to PRO", 403);
    }

    const body = await req.json();
    const parsed = aiSchema.safeParse(body);

    if (!parsed.success) return error("Invalid input");

    const { prompt } = parsed.data;

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    const data = await res.json();

    return success(data);
  } catch {
    return error("AI error", 500);
  }
}