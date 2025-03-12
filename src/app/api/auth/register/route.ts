import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "../../../../../lib/prisma"
import { z } from "zod"

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Validate input
        const result = userSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input data", errors: result.error.errors }, { status: 400 })
        }

        const { name, email, password } = result.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        // Create session (you might want to use a proper session management library)
        // For simplicity, we're just returning the user data

        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

