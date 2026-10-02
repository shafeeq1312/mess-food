import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import voteRoutes from './routes/vote.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

export default app;