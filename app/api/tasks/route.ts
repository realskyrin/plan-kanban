import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const projectId = searchParams.get("projectId");

    const tasks = await prisma.task.findMany({
      where: {
        ...(boardId ? { boardId } : {}),
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const task = await prisma.task.create({
      data: {
        title: json.title,
        description: json.description,
        status: json.status,
        priority: json.priority,
        projectId: json.projectId,
        boardId: json.boardId,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 