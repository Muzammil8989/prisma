import jwt from "jsonwebtoken"

// Get JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET as string

// Token expiration time (e.g., 7 days)
const EXPIRES_IN = 60 * 60 * 24 * 7 // 7 days in seconds

export interface JwtPayload {
    userId: string
    email: string
    name: string
}

export function signJwtToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyJwtToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (error) {
        return null
    }
}

