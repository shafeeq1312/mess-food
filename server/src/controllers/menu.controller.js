import Menu from '../models/Menu.js';

export const listPublishedMenus = async (_, res) => res.json(await Menu.find({ status: 'published' }).sort({ date: -1, createdAt: -1, mealType: 1 }));
export const createMenu = async (req, res) => res.status(201).json(await Menu.create({ ...req.body, status: 'published' }));
export const updateMenu = async (req, res) => res.json(await Menu.findByIdAndUpdate(req.params.id, { ...req.body, items: req.body.items }, { new: true, runValidators: true }));
export const deleteMenu = async (req, res) => { await Menu.findByIdAndDelete(req.params.id); res.json({ message: 'Menu deleted' }); };
export const publishMenu = async (req, res) => res.json(await Menu.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true }));
export const serveMenu = async (req, res) => res.json(await Menu.findByIdAndUpdate(req.params.id, { served: true }, { new: true }));
export const openFeedback = async (req, res) => res.json(await Menu.findByIdAndUpdate(req.params.id, { feedbackOpen: true }, { new: true }));