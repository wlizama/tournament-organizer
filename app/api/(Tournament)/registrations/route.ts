import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const registration = await prisma.registration.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    return new Response("Error retrieving registrations");
  }
}
