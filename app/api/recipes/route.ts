import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-utils"

// GET all recipes with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const authorId = searchParams.get("authorId")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalRecipes = await prisma.recipe.count({ where })

    // Get recipes with pagination
    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    return NextResponse.json({
      recipes,
      pagination: {
        total: totalRecipes,
        page,
        limit,
        pages: Math.ceil(totalRecipes / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST a new recipe (requires authentication)
export async function POST(request: Request) {
  try {
    // Verify authentication
    const payload = await getUserFromRequest(request)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId as string
    const body = await request.json()

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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Create recipe
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        servings,
        difficulty,
        imageUrl,
        authorId: userId,
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

    return NextResponse.json({ message: "Recipe created successfully", recipe }, { status: 201 })
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

