import Vote from '../models/Vote.js';

export const createVote = async (req, res) => {
  try {
    res.status(201).json(await Vote.create({ ...req.body, studentId: req.user.id }));
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'You already voted for this meal' : error.message });
  }
};

export const listMyVotes = async (req, res) => res.json(await Vote.find({ studentId: req.user.id }));