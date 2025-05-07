import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://VantaVerseSakthiSvsp:WfeDMZ$CYkThZm2@vantaverselovegame.cjjckqh.mongodb.net/askitai?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      // Remove any Kerberos-related options
      authSource: 'admin',
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;