import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import User from "../models/User";
import Competition from "../models/Competition";
import Registration from "../models/Registration";
import Submission from "../models/Submission";

const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// Use your Mac's local network IP so images load correctly on
// simulators/physical devices, not just localhost/web.
// Update this if `ipconfig getifaddr en0` ever changes.
const SERVER_IP = "10.2.85.23";
const SERVER_PORT = 5050;
const UPLOADS_BASE = `http://${SERVER_IP}:${SERVER_PORT}/uploads`;

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Competition.deleteMany({}),
    Registration.deleteMany({}),
    Submission.deleteMany({}),
  ]);

  console.log("Creating seed user (already registered)...");
  const seedUser = await User.create({
    name: "Riya Shah",
    email: "riya.shah@example.com",
    password: "password123",
  });

  console.log("Creating competition...");
  const competition = await Competition.create({
    title: "Feedants Classical Dance",
    tags: ["Dance", "Multi-Win"],
    category: "Dance",
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1,
    judge: {
      name: "Manju Dubey",
      title: "Professional Kathak Dancer",
      experience: "12+ Years of Experience",
      photoUrl: `${UPLOADS_BASE}/judgeimage.jpeg`,
      introVideoUrl: "https://example.com/videos/manju-intro.mp4",
    },
    registrationStartAt: daysFromNow(-5),
    registrationEndAt: daysFromNow(2),
    submissionStartAt: daysFromNow(3),
    submissionEndAt: daysFromNow(10),
    resultDate: daysFromNow(12),
    previousWinners: [
      {
        name: "Riya Shah",
        position: "1st Winner",
        thumbnailUrl: `${UPLOADS_BASE}/images.jpeg`,
        videoUrl: "https://example.com/winners/riya.mp4",
      },
      {
        name: "Aarav Mehta",
        position: "1st Winner",
        thumbnailUrl: `${UPLOADS_BASE}/images-2.jpeg`,
        videoUrl: "https://example.com/winners/aarav.mp4",
      },
      {
        name: "Neha Verma",
        position: "2nd Winner",
        thumbnailUrl: `${UPLOADS_BASE}/images-3.jpeg`,
        videoUrl: "https://example.com/winners/neha.mp4",
      },
      {
        name: "Ishita Chohan",
        position: "3rd Winner",
        thumbnailUrl: `${UPLOADS_BASE}/images-4.jpeg`,
        videoUrl: "https://example.com/winners/ishita.mp4",
      },
    ],
    aboutText:
      "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.",
    judgingParameters: [
      "Technique and precision of movements",
      "Expression and storytelling (Abhinaya)",
      "Rhythm and timing (Taal)",
      "Costume and presentation",
      "Overall stage presence",
    ],
    rulesAndEligibility: [
      "Open to all age groups",
      "Performance must be in a recognized classical dance form",
      "Video submissions must be under 5 minutes",
      "Only one submission per participant",
      "Participants must have paid the entry fee to be eligible for judging",
    ],
    rewards: [
      { position: 1, label: "1st Winner", amount: 550 },
      { position: 2, label: "2nd Winner", amount: 300 },
      { position: 3, label: "3rd Winner", amount: 240 },
      { position: 4, label: "4th Winner", amount: 200 },
      { position: 5, label: "5th Winner", amount: 130 },
      { position: 6, label: "6th Winner", amount: 80 },
    ],
    disclaimer: "Only contributions from paid participants will be considered for judging.",
    refundPolicyUrl: "https://feedants.com/refund-policy",
  });

  console.log("Creating seed registration (for seed user)...");
  await Registration.create({
    competitionId: competition._id,
    userId: seedUser._id,
    status: "confirmed",
  });

  console.log("\n✅ Seed complete!");
  console.log("Competition ID:", competition._id.toString());
  console.log("Seed user email: riya.shah@example.com");
  console.log("Seed user password: password123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
