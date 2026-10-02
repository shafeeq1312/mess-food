import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  date: String,
  mealType: String,
  items: [String],
  description: String,
  imageUrl: String,
  status: { type: String, default: 'draft' },
  served: { type: Boolean, default: false },
  feedbackOpen: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema);