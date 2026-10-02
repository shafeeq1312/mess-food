import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  menuId: mongoose.Schema.Types.ObjectId,
  taste: Number,
  quality: Number,
  quantity: Number,
  cleanliness: Number,
  overallRating: Number,
  comment: String
}, { timestamps: true });

feedbackSchema.index({ studentId: 1, menuId: 1 }, { unique: true });

export default mongoose.model('Feedback', feedbackSchema);