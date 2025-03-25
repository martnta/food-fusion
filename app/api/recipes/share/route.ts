import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import crypto from "crypto"

// POST to share a recipe (generate a shareable link)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipeId, userId, shareMethod, recipientEmail } = body

    // Validation
    if (!recipeId || !userId) {
      return NextResponse.json({ error: "Recipe ID and user ID are required" }, { status: 400 })
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Generate a unique share token
    const shareToken = crypto.randomBytes(16).toString("hex")

    // Create a shareable link
    const shareableLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/recipes/shared/${shareToken}`

    // Store share information in database (in a real app)
    // For now, we'll just return the link

    // If email sharing is requested, we would send an email here
    if (shareMethod === "email" && recipientEmail) {
      // In a real app, you would integrate with an email service like SendGrid, Mailgun, etc.
      console.log(`Sending email to ${recipientEmail} with link: ${shareableLink}`)

      // For now, we'll just simulate email sending
      return NextResponse.json({
        message: "Recipe shared successfully via email",
        shareableLink,
        emailSent: true,
        recipientEmail,
      })
    }

    return NextResponse.json({
      message: "Recipe shared successfully",
      shareableLink,
      shareToken,
    })
  } catch (error) {
    console.error("Error sharing recipe:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

