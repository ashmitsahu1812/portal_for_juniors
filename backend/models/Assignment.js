import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  }
}, {
  timestamps: true
});

// Ensure a user can easily get their assignments ordered by due date
assignmentSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model('Assignment', assignmentSchema);
