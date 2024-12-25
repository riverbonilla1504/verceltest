import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("studentstrack")
    const students = await db.collection("students").find({}).toArray()
    return NextResponse.json(students)
  } catch (error) {
    console.error("Failed to fetch students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("studentstrack")
    const { name } = await request.json()
    const student = await db.collection("students").insertOne({ name, grades: [] })
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Failed to add student:", error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}

