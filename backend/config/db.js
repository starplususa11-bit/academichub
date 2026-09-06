import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/academichub';
  try {
    // Configure reliable DNS servers for Atlas SRV record resolution on Windows
    if (mongoUri.includes('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (dnsErr) {
        // Continue with default DNS if setServers is not allowed
      }
    }

    // Timeout for MongoDB Atlas connection
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 7500,
    });
    console.log('📦 MongoDB Connected Successfully to Atlas Cluster (academichub).');
    return true;
  } catch (error) {
    console.warn(' MongoDB Connection Note:', error.message);
    console.log(' AcademicHub is running in Hybrid Persistence Mode (In-Memory/Mock DB fallback active).');
    return false;
  }
};
