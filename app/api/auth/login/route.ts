import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/db"
import { generateToken } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: "Account locked",
          message: `Too many failed attempts. Try again in ${remainingTime} seconds.`,
          lockedUntil: user.lockedUntil,
        },
        { status: 423 },
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      // Increment failed login attempts
      const updatedFailedAttempts = user.failedLoginAttempts + 1

      // Check if account should be locked
      let lockedUntil = null
      if (updatedFailedAttempts >= 3) {
        // Lock account for 3 minutes
        lockedUntil = new Date(Date.now() + 3 * 60 * 1000)
      }

      // Update user with failed attempts and lock status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: updatedFailedAttempts,
          lockedUntil,
        },
      })

      if (lockedUntil) {
        return NextResponse.json(
          {
            error: "Account locked",
            message: "Too many failed attempts. Your account is locked for 3 minutes.",
            lockedUntil,
          },
          { status: 423 },
        )
      }

      return NextResponse.json(
        {
          error: "Invalid credentials",
          attemptsRemaining: 3 - updatedFailedAttempts,
        },
        { status: 401 },
      )
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    })

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    })

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

