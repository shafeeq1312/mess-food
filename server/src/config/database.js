import mongoose from 'mongoose';

const connectDatabase = () => mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food');

export default connectDatabase;