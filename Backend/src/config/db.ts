import mongoose from 'mongoose';

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vuln_genome';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Successfully connected to database: ${mongoose.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[MongoDB Warning] Operating in hybrid resilient mode (In-Memory Fallback will serve live operations if Mongo is unavailable).`);
    return false;
  }
}
