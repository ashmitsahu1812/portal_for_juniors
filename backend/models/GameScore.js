import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameType: {
    type: String,
    enum: ['memory', 'sudoku'],
    required: true,
  },
  timeTakenSeconds: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for quickly fetching leaderboards (e.g., fastest times today)
gameScoreSchema.index({ gameType: 1, timeTakenSeconds: 1, createdAt: -1 });

export default mongoose.model('GameScore', gameScoreSchema);
