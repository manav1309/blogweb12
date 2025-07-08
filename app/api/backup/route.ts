import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createBackup, getBackups } from "@/lib/db/backup"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backups = await getBackups()
    return NextResponse.json(backups)
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Failed to fetch backups" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "super-admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backup = await createBackup()
    return NextResponse.json(backup, { status: 201 })
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}
