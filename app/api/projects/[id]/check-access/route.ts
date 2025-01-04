import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { canViewProject } from "@/lib/permissions"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const projectId = params.id
    const hasAccess = await canViewProject(user.id, projectId)

    if (!hasAccess) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PROJECT_CHECK_ACCESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 