import { Response } from "express";
import mongoose from "mongoose";
import Competition from "../models/Competition";
import Registration from "../models/Registration";
import { computeStage } from "../utils/competitionStage";
import { AuthRequest } from "../middleware/auth";

export const getCompetitionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid competition ID" });
    return;
  }

  const competition = await Competition.findById(id).lean();
  if (!competition) {
    res.status(404).json({ message: "Competition not found" });
    return;
  }

  const now = new Date();

  const currentStage = computeStage({
    now,
    registrationStartAt: competition.registrationStartAt,
    registrationEndAt: competition.registrationEndAt,
    submissionStartAt: competition.submissionStartAt,
    submissionEndAt: competition.submissionEndAt,
    resultDate: competition.resultDate,
  });

  const spotsLeft = Math.max(competition.totalSpots - competition.bookedSpots, 0);

  // isRegistered only meaningful if the request is authenticated.
  // requireAuth is NOT applied to this route (it should be publicly
  // viewable), so req.userId may be undefined — that's fine.
  let isRegistered = false;
  if (req.userId) {
    const existingRegistration = await Registration.findOne({
      competitionId: competition._id,
      userId: req.userId,
      status: "confirmed",
    }).lean();
    isRegistered = !!existingRegistration;
  }

  res.status(200).json({
    ...competition,
    spotsLeft,
    currentStage,
    isRegistered,
    serverTime: now.toISOString(),
  });
};
