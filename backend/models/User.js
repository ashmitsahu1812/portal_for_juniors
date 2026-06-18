import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  progress: {
    completedModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    }],
    quizScores: [{
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      score: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      completedAt: { type: Date, default: Date.now },
    }],
    solvedProblems: [{
      problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
      verdict: { type: String, required: true },
      solvedAt: { type: Date, default: Date.now },
    }],
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
