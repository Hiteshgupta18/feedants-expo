import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import Competition from "../models/Competition";

const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const run = async () => {
  await connectDB();

  const competitionId = "6ab3a96eca6b23ee303d01db";

  const updated = await Competition.findByIdAndUpdate(
    competitionId,
    {
      registrationEndAt: daysFromNow(-2),  // registration closed 2 days ago
      submissionStartAt: daysFromNow(-1),  // submission opened yesterday
      submissionEndAt: daysFromNow(5),     // submission ends in 5 days
    },
    { new: true }
  );

  console.log("Updated dates:");
  console.log("registrationEndAt:", updated?.registrationEndAt);
  console.log("submissionStartAt:", updated?.submissionStartAt);
  console.log("submissionEndAt:", updated?.submissionEndAt);

  await mongoose.disconnect();
  process.exit(0);
};

run();
