import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  menuId: mongoose.Schema.Types.ObjectId,
  vote: String
}, { timestamps: true });

voteSchema.index({ studentId: 1, menuId: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);