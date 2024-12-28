import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface TaskWithOrder extends Prisma.TaskGetPayload<{
  include: { project: true }
}> {
  order: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const tasks = await prisma.task.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as TaskWithOrder[];

    // 按 order 字段手动排序
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

    return NextResponse.json(sortedTasks);
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

    // 获取同一状态下的最后一个任务的顺序
    const lastTask = await prisma.task.findFirst({
      where: {
        projectId: json.projectId,
        status: json.status,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as TaskWithOrder | null;

    const order = lastTask?.order ? lastTask.order + 1000 : 1000;

    const task = await prisma.task.create({
      data: {
        title: json.title,
        description: json.description || null,
        status: json.status,
        priority: json.priority,
        projectId: json.projectId,
        order,
      } as unknown as Prisma.TaskCreateInput,
      include: {
        project: true,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 