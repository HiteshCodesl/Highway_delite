import prismaClient from "@/app/config/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/config/authOption";

export async function POST(req: NextRequest) {
  const {content}  = await req.json();
  const session = await getServerSession(authOptions);

  console.log(session?.user.id, content, "content and useID inside the route.ts");

  if(!session?.user?.id || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const notes = await prismaClient.note.create({
    data: {
        content: content,
        userId: session?.user?.id
    },
  });

  if (!notes) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  return NextResponse.json(notes, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if(!session?.user?.id || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prismaClient.note.findMany({
    where: {
      userId: session?.user?.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!notes) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  return NextResponse.json(notes, { status: 200 });
} 

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if(!session?.user?.id || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Id required" }, { status: 400 });
  }

  const note = await prismaClient.note.delete({
    where: {
      id: id,
      userId: session?.user?.id
    },

  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 400 });
  }

  return NextResponse.json(note, { status: 200 });
}
