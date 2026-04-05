import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { goal, weight, height, activity } = body;

    const prompt = `
    Napravi plan ishrane za:
    - Cilj: ${goal}
    - Težina: ${weight}kg
    - Visina: ${height}cm
    - Aktivnost: ${activity}

    Daj konkretna jela za 1 dan (doručak, ručak, večera).
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ti si fitness trener." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    const result = data.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}