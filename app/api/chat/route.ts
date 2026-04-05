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
      include: { messages: true },
    });

    const { message } = await req.json();

    // 💾 save user message
    await prisma.message.create({
      data: {
        role: "user",
        content: message,
        userId: user!.id,
      },
    });

    // 🧠 last 10 messages
    const history = await prisma.message.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply = ai.choices[0].message.content || "";

    // 💾 save AI reply
    await prisma.message.create({
      data: {
        role: "assistant",
        content: reply,
        userId: user!.id,
      },
    });

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Chat error" }, { status: 500 });
  }
}