import { NextResponse } from "next/server"

export async function POST() {
    try {
        // In a real application, you would invalidate the session here
        // For simplicity, we're just returning a success response

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

