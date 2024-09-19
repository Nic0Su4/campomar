import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const mesas = await prisma.mesas.findMany();

  if (!mesas) {
    return NextResponse.json(
      { message: "No se encontraron mesas" },
      { status: 404 }
    );
  }

  return NextResponse.json(mesas);
}
