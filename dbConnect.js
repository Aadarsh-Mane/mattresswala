import mongoose from "mongoose";

const dbURI =
  "mongodb+srv://setulankur:setu123@cluster0.tzdjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const connectDB = async () => {
  const options = {
    useNewUrlParser: true, // Deprecated, but necessary in older versions
    useUnifiedTopology: true, // Use MongoDB's native driver for connection pooling
    connectTimeoutMS: 2000000, // Increase initial connection timeout
    socketTimeoutMS: 5000000, // Increase socket operation timeout
    maxPoolSize: 50, // Maximum number of concurrent connections in the pool
    minPoolSize: 5, // Minimum number of connections to maintain in the pool
    autoIndex: true, // Automatically build indexes (set to false if you manage indexes manually)
  };

  try {
    await mongoose.connect(dbURI, options);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(dbURI);
    console.error("Failed to connect to MongoDB", err.message);
    process.exit(1);
  }
};
