import mongoose from "mongoose";


const dbUrl: string | undefined = process.env.MONGO_URI;

if (!dbUrl) {
  console.error('MONGO_URI is undefined please provide database URL');
  process.exit(1);
}

const connectDB = async () => {
  try {

    const connect = await mongoose.connect(dbUrl, { dbName: "Hive_DB" });

    console.log(`Server connected to host ${connect.connection.host}`);

  } catch (error) {
    console.error(`Failed to connect to database`, error);
    process.exit(1);
  }
}

export default connectDB;