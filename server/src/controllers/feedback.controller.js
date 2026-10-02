import Feedback from '../models/Feedback.js';
import Menu from '../models/Menu.js';

export const createFeedback = async (req, res) => {
  const menu = await Menu.findById(req.body.menuId);
  if (!menu?.served || !menu.feedbackOpen) return res.status(400).json({ message: 'Reviews are not open for this meal yet' });

  try {
    res.status(201).json(await Feedback.create({ ...req.body, studentId: req.user.id }));
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Feedback already submitted' : error.message });
  }
};

export const listMyFeedback = async (req, res) => {
  const feedback = await Feedback.find({ studentId: req.user.id }).sort({ createdAt: -1 });
  res.json(feedback);
};

export const deleteFeedback = async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: 'Feedback deleted' });
};