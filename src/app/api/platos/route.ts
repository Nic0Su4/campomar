import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const platos = await prisma.platos.findMany();

  if (!platos) {
    return NextResponse.json(
      { message: "No se encontraron platos" },
      { status: 404 }
    );
  }

  return NextResponse.json(platos);
}
