import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest, context: any) {
  try {
    const { id } = context.params  // Aquí accedes a los params correctamente
    const client = await clientPromise
    const db = client.db('studentstrack')
    const { grade } = await request.json()

    const studentId = new ObjectId(id)

    const student = await db.collection("students").findOne({ _id: studentId })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (!Array.isArray(student.grades)) {
      await db.collection("students").updateOne(
        { _id: studentId },
        { $set: { grades: [] } }
      )
    }

    const result = await db.collection("students").updateOne(
      { _id: studentId },
      { $push: { grades: grade } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to add grade" }, { status: 500 })
    }

    return NextResponse.json({ message: "Grade added successfully" }, { status: 200 })
  } catch (error) {
    console.error('Failed to add grade:', error)
    return NextResponse.json({ error: "Failed to add grade" }, { status: 500 })
  }
}
