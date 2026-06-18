import mongoose from 'mongoose';

const LevelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  title: { type: String, required: true },
  theoryText: { type: String, required: true },
  youtubeUrl: { type: String }, // Optional YouTube embed link
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
});

const PathwaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Map' }, // lucide icon name
  levels: [LevelSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Pathway', PathwaySchema);
