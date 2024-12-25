import { ObjectId } from 'mongodb';

export interface Student {
  _id: ObjectId; // ID del documento en MongoDB
  name: string;  // Nombre del estudiante
  grades: number[]; // Arreglo de calificaciones
}