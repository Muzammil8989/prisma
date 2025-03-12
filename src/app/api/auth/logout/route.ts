import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        // Clear the token cookie
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
        response.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0, // Expire immediately
        })

        return response
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}