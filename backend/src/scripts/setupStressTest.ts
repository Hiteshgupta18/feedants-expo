import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/User";
import Competition from "../models/Competition";
import Registration from "../models/Registration";

const COMPETITION_ID = "6ab3a96eca6b23ee303d01db";
const NUM_STRESS_USERS = 50;
const SPOTS_TO_LEAVE = 5;

const run = async () => {
  await connectDB();

  console.log("Cleaning up any previous stress-test users...");
  const oldUsers = await User.find({ email: /^stress/ }).select("_id");
  const oldUserIds = oldUsers.map((u) => u._id);
  await Registration.deleteMany({ userId: { $in: oldUserIds } });
  await User.deleteMany({ email: /^stress/ });

  console.log(`Creating ${NUM_STRESS_USERS} fresh stress-test users...`);
  const users = [];
  for (let i = 0; i < NUM_STRESS_USERS; i++) {
    const user = await User.create({
      name: `Stress User ${i}`,
      email: `stress${i}@example.com`,
      password: "password123",
    });
    users.push(user);
  }

  console.log("Resetting competition to exactly", SPOTS_TO_LEAVE, "spots left...");
  const competition = await Competition.findById(COMPETITION_ID);
  if (!competition) throw new Error("Competition not found — check COMPETITION_ID");

  const bookedSpots = competition.totalSpots - SPOTS_TO_LEAVE;
  await Competition.findByIdAndUpdate(COMPETITION_ID, { bookedSpots });

  // Clear all existing registrations for a clean test (keeps things simple —
  // we're isolating the concurrency mechanism, not testing on top of old state)
  await Registration.deleteMany({ competitionId: COMPETITION_ID });

  console.log("\n✅ Stress test setup complete!");
  console.log(`Competition now has bookedSpots=${bookedSpots}, totalSpots=${competition.totalSpots}`);
  console.log(`=> spotsLeft = ${SPOTS_TO_LEAVE}`);
  console.log(`${NUM_STRESS_USERS} stress-test users created (stress0@example.com ... stress${NUM_STRESS_USERS - 1}@example.com), all with password "password123"`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
