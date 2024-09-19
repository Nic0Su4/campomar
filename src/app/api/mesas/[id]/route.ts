import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

interface Segments {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Segments) {
  const { id } = params;

  const todo = await prisma.mesas.findUnique({
    where: {
      MesaID: parseInt(id),
    },
  });

  if (!todo) {
    return NextResponse.json(
      { message: "Mesa no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(todo);
}
