import { Response } from "express";
import mongoose from "mongoose";
import Competition from "../models/Competition";
import Registration from "../models/Registration";
import { computeStage } from "../utils/competitionStage";
import { AuthRequest } from "../middleware/auth";

export const registerForCompetition = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid competition ID" });
    return;
  }

  // Fetch once up front to validate stage/timing BEFORE attempting the
  // atomic spot reservation. This is a read, not the safety mechanism —
  // the real protection against overbooking is the atomic
  // findOneAndUpdate below, not this check.
  const competitionPreview = await Competition.findById(id).lean();
  if (!competitionPreview) {
    res.status(404).json({ message: "Competition not found" });
    return;
  }

  const now = new Date();
  const stage = computeStage({
    now,
    registrationStartAt: competitionPreview.registrationStartAt,
    registrationEndAt: competitionPreview.registrationEndAt,
    submissionStartAt: competitionPreview.submissionStartAt,
    submissionEndAt: competitionPreview.submissionEndAt,
    resultDate: competitionPreview.resultDate,
  });

  if (stage !== "registration_open") {
    res.status(400).json({
      message: "Registration is not open for this competition",
      currentStage: stage,
    });
    return;
  }

  const session = await mongoose.startSession();

  try {
    let registrationDoc;

    await session.withTransaction(async () => {
      // THE atomic operation: increment bookedSpots ONLY if it's still
      // below totalSpots, checked and applied as a single indivisible
      // DB operation. Under concurrent load, MongoDB serializes these
      // updates internally — only requests that see bookedSpots < totalSpots
      // at the moment of the actual write succeed. Once spots hit the cap,
      // findOneAndUpdate returns null for everyone else, no matter how
      // many requests arrive simultaneously.
      const updatedCompetition = await Competition.findOneAndUpdate(
        { _id: id, bookedSpots: { $lt: competitionPreview.totalSpots } },
        { $inc: { bookedSpots: 1 } },
        { new: true, session }
      );

      if (!updatedCompetition) {
        throw new Error("COMPETITION_FULL");
      }

      // Create the Registration doc inside the same transaction.
      // The unique compound index on {competitionId, userId} guarantees
      // that even if this same user fires two requests at once, only
      // one Registration document can ever exist — the second insert
      // throws E11000, the transaction aborts, and bookedSpots rolls
      // back automatically since it was part of the same transaction.
      const created = await Registration.create(
        [
          {
            competitionId: id,
            userId,
            status: "confirmed",
          },
        ],
        { session }
      );

      registrationDoc = created[0];
    });

    res.status(201).json({
      message: "Registration successful",
      registration: registrationDoc,
    });
  } catch (err: any) {
    if (err.message === "COMPETITION_FULL") {
      res.status(409).json({ message: "No spots remaining. Competition is full." });
      return;
    }

    if (err.code === 11000) {
      res.status(409).json({ message: "You are already registered for this competition." });
      return;
    }

    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error during registration" });
  } finally {
    session.endSession();
  }
};
