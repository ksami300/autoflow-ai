import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ti si nutricionista." },
        {
          role: "user",
          content: `Cilj: ${body.goal}, Težina: ${body.weight}, Visina: ${body.height}`,
        },
      ],
    });

    return NextResponse.json({
      plan: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}