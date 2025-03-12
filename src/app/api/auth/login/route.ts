import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { signJwtToken } from "@/lib/jwt"
import { cookies } from "next/headers"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validate input
        const result = loginSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input data", errors: result.error.errors }, { status: 400 })
        }

        const { email, password } = result.data

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        // Verify password
        const passwordMatch = await compare(password, user.password)
        if (!passwordMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        // Generate JWT token
        // Generate JWT token
        const token = signJwtToken({
            userId: user.id,
            email: user.email,
            name: user.name,
        })

        // Set cookie with the token
        const cookieValue = `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`
        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            {
                status: 201,
                headers: {
                    'Set-Cookie': cookieValue,
                },
            },
        )
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

