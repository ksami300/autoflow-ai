import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { goal, weight, height, activity, result } = await req.json();

    const plan = await prisma.plan.create({
      data: {
        goal,
        weight: Number(weight),
        height: Number(height),
        activity,
        result,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}