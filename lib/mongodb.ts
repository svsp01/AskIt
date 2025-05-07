import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://VantaVerseSakthiSvsp:WfeDMZ$CYkThZm2@vantaverselovegame.cjjckqh.mongodb.net/askitai?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;