import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('studentstrack')
    const { grade } = await request.json()

    const studentId = new ObjectId(context.params.id) // Usar context.params para obtener el ID

    // Asegúrate de que el campo grades sea un arreglo antes de intentar agregar la calificación
    const student = await db.collection("students").findOne({ _id: studentId })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Si grades no es un arreglo, inicialízalo
    if (!Array.isArray(student.grades)) {
      await db.collection("students").updateOne(
        { _id: studentId },
        { $set: { grades: [] } }  // Inicializa grades como un arreglo vacío si no lo es
      )
    }

    // Agregar la calificación al arreglo de grades
    const result = await db.collection("students").updateOne(
      { _id: studentId },
      { $push: { grades: grade } }  // Solo agrega la calificación sin sobrescribir grades
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
