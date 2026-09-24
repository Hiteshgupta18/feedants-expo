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
      registrationStartAt: daysFromNow(-5),
      registrationEndAt: daysFromNow(2),
      submissionStartAt: daysFromNow(3),
      submissionEndAt: daysFromNow(10),
      resultDate: daysFromNow(12),
    },
    { new: true }
  );

  console.log("Reset to registration_open window:");
  console.log("registrationEndAt:", updated?.registrationEndAt);

  await mongoose.disconnect();
  process.exit(0);
};

run();
