import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('studentstrack')
    const { grade } = await request.json()

    // Asegúrate de que el id sea un ObjectId válido
    const studentId = new ObjectId(params.id)

    // Actualiza el documento y agrega una nueva calificación
    const result = await db.collection("students").updateOne(
      { _id: studentId },
      {
        $push: { grades: grade }  // Agregar la calificación a grades
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Grade added successfully" }, { status: 200 })
  } catch (error) {
    console.error('Failed to add grade:', error)
    return NextResponse.json({ error: "Failed to add grade" }, { status: 500 })
  }
}
