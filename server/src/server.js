import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.js';
import seedAdmin from './config/seedAdmin.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedAdmin();
    app.listen(port, () => console.log(`MessMate API running on port ${port}`));
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();