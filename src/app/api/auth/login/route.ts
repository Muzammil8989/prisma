import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { prisma } from "../../../../../lib/prisma"
import { z } from "zod"

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

        // Create session (you might want to use a proper session management library)
        // For simplicity, we're just returning the user data

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

