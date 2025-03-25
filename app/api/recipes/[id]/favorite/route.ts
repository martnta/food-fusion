import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-utils"

// GET check if user has favorited a recipe
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId = params.id

    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST add recipe to favorites
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId = params.id

    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ message: "Recipe already in favorites" })
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        recipeId,
      },
    })

    return NextResponse.json({ message: "Recipe added to favorites", favorite })
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE remove recipe from favorites
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId = params.id

    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    if (!favorite) {
      return NextResponse.json({ message: "Recipe not in favorites" })
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    return NextResponse.json({ message: "Recipe removed from favorites" })
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

