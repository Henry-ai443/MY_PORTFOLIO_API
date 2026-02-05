import mongoose from "mongoose";

const uri = (process.env.MONGODB_URI || process.env.MONGO_URI)?.trim();

const connectDB = async () => {
  if (!uri || typeof uri !== "string") {
    console.error(
      "MongoDB URI is missing. Set MONGODB_URI or MONGO_URI in your .env file (e.g. MONGODB_URI=mongodb://localhost:27017/portfolio)"
    );
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Force IPv4 to avoid TLS handshake issues with Atlas on some networks/Node versions
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
