import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-utils"

// GET a specific recipe
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        _count: {
          select: {
            favorites: true,
            comments: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Get average rating if needed
    const ratings = await prisma.comment.findMany({
      where: { recipeId: id, rating: { not: null } },
      select: { rating: true },
    })

    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, item) => sum + (item.rating || 0), 0) / ratings.length : null

    return NextResponse.json({
      ...recipe,
      averageRating,
      ratingCount: ratings.length,
    })
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT (update) a recipe
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string
    const body = await request.json()

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if user is the author
    if (existingRecipe.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized: You can only edit your own recipes" }, { status: 403 })
    }

    const { title, description, ingredients, instructions, cookingTime, servings, difficulty, categoryId, imageUrl } =
      body

    // Validation
    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !cookingTime ||
      !servings ||
      !difficulty ||
      !categoryId
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if category exists if changed
    if (categoryId !== existingRecipe.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
    }

    // Update recipe
    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        imageUrl,
        categoryId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json({ message: "Recipe updated successfully", recipe: updatedRecipe })
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a recipe
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if user is the author
    if (existingRecipe.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized: You can only delete your own recipes" }, { status: 403 })
    }

    // Delete related comments first
    await prisma.comment.deleteMany({
      where: { recipeId: id },
    })

    // Delete related favorites
    await prisma.favorite.deleteMany({
      where: { recipeId: id },
    })

    // Delete recipe
    await prisma.recipe.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

