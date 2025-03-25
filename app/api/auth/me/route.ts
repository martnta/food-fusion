import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    // Get user from token
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

