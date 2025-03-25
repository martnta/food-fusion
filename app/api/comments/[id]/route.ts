import { NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET a specific comment
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const comment = await prisma.comment.findUnique({
      where: { id },
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

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error fetching comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT (update) a comment
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { content, userId } = body

    // Validation
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author of the comment
    if (existingComment.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized: You can only edit your own comments" }, { status: 403 })
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    return NextResponse.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a comment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author of the comment
    if (existingComment.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized: You can only delete your own comments" }, { status: 403 })
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

