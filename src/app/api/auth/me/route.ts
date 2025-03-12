import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwtToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Get token from cookies
        const token = (await cookies()).get("token")?.value

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Verify token
        const payload = verifyJwtToken(token)
        if (!payload) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error("Get user error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

