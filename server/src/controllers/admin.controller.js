import Feedback from '../models/Feedback.js';
import Menu from '../models/Menu.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';

export const overview = async (_, res) => {
  const menus = await Menu.find().sort({ date: -1 }).limit(10);
  const votes = await Vote.aggregate([{ $group: { _id: { menuId: '$menuId', vote: '$vote' }, count: { $sum: 1 } } }]);
  const feedback = await Feedback.find().populate('studentId', 'name email').sort({ createdAt: -1 }).limit(8);
  const all = await Feedback.find();
  const studentCount = await User.countDocuments({ role: 'student' });
  const average = (key) => all.length ? (all.reduce((sum, item) => sum + item[key], 0) / all.length).toFixed(1) : '0.0';
  res.json({ menus, votes, feedback, studentCount, averages: { overallRating: average('overallRating'), taste: average('taste'), quality: average('quality'), quantity: average('quantity'), cleanliness: average('cleanliness') } });
};