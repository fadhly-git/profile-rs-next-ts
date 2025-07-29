import { NextResponse } from "next/server"

export async function POST() {
    try {
        // TODO: Implement delete logic here  
        return NextResponse.json({ message: "upload endpoint via POST" })
    } catch {
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 }
        )
    }
}