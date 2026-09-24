import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/User";
import Competition from "../models/Competition";
import Registration from "../models/Registration";
import Submission from "../models/Submission";

const run = async () => {
  await connectDB();
  console.log("User indexes:", await User.collection.getIndexes());
  console.log("Competition indexes:", await Competition.collection.getIndexes());
  console.log("Registration indexes:", await Registration.collection.getIndexes());
  console.log("Submission indexes:", await Submission.collection.getIndexes());
  await mongoose.disconnect();
  process.exit(0);
};

run();
