import { NextResponse } from "next/server"

// GET a shared recipe by token
export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const token = params.token

    // In a real app, you would look up the token in your database
    // For now, we'll simulate this by returning a mock recipe

    // This is where you would query your database for the shared recipe
    // const sharedRecipe = await prisma.sharedRecipe.findUnique({
    //   where: { shareToken: token },
    //   include: { recipe: true }
    // })

    // For demonstration purposes, we'll return a mock recipe
    const mockRecipe = {
      id: "mock-recipe-id",
      title: "Shared Chocolate Cake Recipe",
      description: "A delicious chocolate cake recipe shared with you",
      ingredients: "Flour, Sugar, Cocoa Powder, Eggs, Milk, Butter",
      instructions: "1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350°F for 30 minutes",
      cookingTime: 45,
      servings: 8,
      difficulty: "Medium",
      imageUrl: "/placeholder.svg?height=400&width=600",
      author: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
      },
      category: {
        name: "Desserts",
      },
      createdAt: new Date().toISOString(),
      sharedAt: new Date().toISOString(),
      sharedBy: {
        firstName: "John",
        lastName: "Smith",
      },
    }

    return NextResponse.json({
      message: "Shared recipe retrieved successfully",
      recipe: mockRecipe,
      shareToken: token,
    })
  } catch (error) {
    console.error("Error retrieving shared recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

