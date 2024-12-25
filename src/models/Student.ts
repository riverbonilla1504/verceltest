import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema({
  name: String,
  grades: [Number],
})

StudentSchema.virtual('average').get(function() {
  if (this.grades.length === 0) return 0
  const sum = this.grades.reduce((a, b) => a + b, 0)
  return sum / this.grades.length
})

export default mongoose.models.Student || mongoose.model('Student', StudentSchema)

