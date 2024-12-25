import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('studentstrack')
    const { grade } = await request.json()

    const studentId = new ObjectId(context.params.id) // Usar context.params para obtener el ID

    // Asegúrate de que el campo 'grades' sea un arreglo
    const result = await db.collection("students").updateOne(
      { _id: studentId },
      {
        $set: { grades: [] },  // Asegura que grades sea un arreglo
        $push: { grades: grade }  // Agrega la calificación al arreglo grades
      },
      { upsert: true }  // Si el estudiante no existe, lo crea
    )

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json({ error: "Student not found or created" }, { status: 404 })
    }

    return NextResponse.json({ message: "Grade added successfully" }, { status: 200 })
  } catch (error) {
    console.error('Failed to add grade:', error)
    return NextResponse.json({ error: "Failed to add grade" }, { status: 500 })
  }
}
