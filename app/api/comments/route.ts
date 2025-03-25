import { NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET all comments for a recipe
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recipeId = searchParams.get("recipeId")

    if (!recipeId) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { recipeId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, userId, recipeId } = body

    // Validation
    if (!content || !userId || !recipeId) {
      return NextResponse.json({ error: "Content, user ID, and recipe ID are required" }, { status: 400 })
    }

    // Check if user and recipe exist
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        recipeId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ message: "Comment added successfully", comment }, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

