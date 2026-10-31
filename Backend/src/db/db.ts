import mongoose from 'mongoose';

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }

}

export default connectDB;
