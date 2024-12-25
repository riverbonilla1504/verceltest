'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
  _id: string
  name: string
  grades: number[]
  average?: number // La propiedad average puede ser undefined inicialmente
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudentName, setNewStudentName] = useState('')
  const [newGrade, setNewGrade] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/students')
      if (!res.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await res.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const addStudent = async () => {
    if (!newStudentName) return
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newStudentName })
    })
    setNewStudentName('')
    fetchStudents()
  }

  const addGrade = async () => {
    if (!selectedStudent || !newGrade) return
    await fetch(`/api/students/${selectedStudent}/grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade: Number(newGrade) })
    })
    setNewGrade('')
    fetchStudents()
  }

  // Función para calcular el promedio
  const calculateAverage = (grades: number[]) => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((acc, grade) => acc + grade, 0)
    return total / grades.length
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestor de Estudiantes y Notas</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Agregar Estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Nombre del estudiante"
            />
            <Button onClick={addStudent}>Agregar</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Agregar Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <select
              className="border p-2 rounded"
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Seleccionar estudiante</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              placeholder="Nota"
            />
            <Button onClick={addGrade}>Agregar Nota</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {students.map((student) => {
              const average = calculateAverage(student.grades)
              return (
                <li key={student._id} className="mb-2">
                  <strong>{student.name}</strong> - Notas: {student.grades.join(', ')} - 
                  Promedio: {average > 0 ? average.toFixed(2) : 'N/A'}
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
