import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const disciplines = await prisma.discipline.findMany();

    return NextResponse.json(disciplines);
  } catch (error) {
    return new Response("Error retrieving disciplines", { status: 500 });
  }
}
