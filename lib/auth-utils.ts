import { JWTPayload, jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing and verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_jwt_secret_key_change_this_in_production",
)

// Token expiration (24 hours)
const TOKEN_EXPIRATION = "24h"

// Generate a JWT token for a user
export async function generateToken(payload: unknown) {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(JWT_SECRET)
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null
  }
}

// Extract user from request headers
export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  return await verifyToken(token)
}

