import { NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    // Validation
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Create category
    const category = await prisma.category.create({
      data: { name },
    })

    return NextResponse.json({ message: "Category created successfully", category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
