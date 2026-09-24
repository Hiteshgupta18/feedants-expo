import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import Competition from "../models/Competition";
import Registration from "../models/Registration";

const COMPETITION_ID = "6ab3a96eca6b23ee303d01db";
const NUM_STRESS_USERS = 50;
const API_BASE = `http://localhost:${process.env.PORT || 5050}/api`;

interface LoginResult {
  email: string;
  token: string;
}

const loginAllUsers = async (): Promise<LoginResult[]> => {
  console.log(`Logging in ${NUM_STRESS_USERS} users (sequentially, this is just setup)...`);
  const results: LoginResult[] = [];

  for (let i = 0; i < NUM_STRESS_USERS; i++) {
    const email = `stress${i}@example.com`;
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" }),
    });
    const data = await res.json();
    if (!data.token) {
      throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
    }
    results.push({ email, token: data.token });
  }

  console.log("All users logged in.\n");
  return results;
};

const fireAllRegistrationsSimultaneously = async (users: LoginResult[]) => {
  console.log(`🔥 Firing ${users.length} registration requests SIMULTANEOUSLY...\n`);

  const startTime = Date.now();

  const results = await Promise.all(
    users.map(async (user) => {
      try {
        const res = await fetch(
          `${API_BASE}/competitions/${COMPETITION_ID}/register`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        return { email: user.email, status: res.status, body: data };
      } catch (err: any) {
        return { email: user.email, status: 0, body: { message: err.message } };
      }
    })
  );

  const duration = Date.now() - startTime;
  console.log(`All requests completed in ${duration}ms.\n`);

  return results;
};

const run = async () => {
  await connectDB();

  const competitionBefore = await Competition.findById(COMPETITION_ID).lean();
  const bookedSpotsBefore = competitionBefore?.bookedSpots ?? 0;
  const totalSpots = competitionBefore?.totalSpots ?? 0;
  const expectedSpotsLeft = totalSpots - bookedSpotsBefore;

  console.log(`Before test: bookedSpots=${bookedSpotsBefore}, totalSpots=${totalSpots}, spotsLeft=${expectedSpotsLeft}\n`);

  const users = await loginAllUsers();
  const results = await fireAllRegistrationsSimultaneously(users);

  const successes = results.filter((r) => r.status === 201);
  const failures = results.filter((r) => r.status !== 201);

  console.log("=== RESULTS ===");
  console.log(`✅ Successful registrations: ${successes.length}`);
  console.log(`❌ Rejected registrations: ${failures.length}`);

  console.log("\n--- Sample of rejection reasons ---");
  const uniqueReasons = new Set(failures.map((f) => f.body.message));
  uniqueReasons.forEach((reason) => console.log(" -", reason));

  const competitionAfter = await Competition.findById(COMPETITION_ID).lean();
  const registrationCountAfter = await Registration.countDocuments({
    competitionId: COMPETITION_ID,
  });

  console.log("\n=== DATABASE VERIFICATION ===");
  console.log(`Competition.totalSpots: ${competitionAfter?.totalSpots}`);
  console.log(`Competition.bookedSpots: ${competitionAfter?.bookedSpots}`);
  console.log(`Actual Registration documents in DB (this competition): ${registrationCountAfter}`);

  const isOverbooked = (competitionAfter?.bookedSpots ?? 0) > (competitionAfter?.totalSpots ?? 0);
  const newRegistrationsCreated = registrationCountAfter;
  const successCountMatchesNewRegistrations = successes.length === newRegistrationsCreated;
  const successCountMatchesExpectedSpots = successes.length === expectedSpotsLeft;

  console.log("\n=== VERDICT ===");
  if (isOverbooked) {
    console.log("❌ FAIL: Competition is OVERBOOKED. bookedSpots exceeds totalSpots!");
  } else if (!successCountMatchesNewRegistrations) {
    console.log(
      `❌ FAIL: ${successes.length} requests reported success, but only ${newRegistrationsCreated} Registration documents exist. Data inconsistency!`
    );
  } else if (!successCountMatchesExpectedSpots) {
    console.log(
      `❌ FAIL: Expected exactly ${expectedSpotsLeft} successful registrations (matching spotsLeft before the test), got ${successes.length}`
    );
  } else {
    console.log(
      `✅ PASS: Exactly ${successes.length} registrations succeeded (matching the ${expectedSpotsLeft} available spots), no overbooking, no data inconsistency.`
    );
    console.log("The atomic findOneAndUpdate + transaction correctly serialized 50 concurrent requests.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Stress test failed:", err);
  process.exit(1);
});
