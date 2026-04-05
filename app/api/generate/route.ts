import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { plans: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPro && user.plans.length >= 3) {
      return NextResponse.json({ error: "Upgrade to Pro" }, { status: 403 });
    }

    const { goal, weight, height, activity } = await req.json();

    const prompt = `
Ti si profesionalni nutricionista.

Podaci:
- cilj: ${goal}
- težina: ${weight}
- visina: ${height}
- aktivnost: ${activity}

Daj:
- kalorije
- makroe
- obroke
- savete
`;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = ai.choices[0].message.content || "Greška";

    await prisma.plan.create({
      data: {
        goal,
        result,
        userId: user.id,
      },
    });

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}