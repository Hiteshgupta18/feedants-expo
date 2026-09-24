import { Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Competition from "../models/Competition";
import Registration from "../models/Registration";
import Submission from "../models/Submission";
import { computeStage } from "../utils/competitionStage";
import { AuthRequest } from "../middleware/auth";

const submissionSchema = z.object({
  submissionUrl: z.string().url(),
  notes: z.string().optional(),
});

export const createSubmission = async (
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

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }

  const competition = await Competition.findById(id).lean();
  if (!competition) {
    res.status(404).json({ message: "Competition not found" });
    return;
  }

  // Must be registered to submit
  const registration = await Registration.findOne({
    competitionId: id,
    userId,
    status: "confirmed",
  }).lean();

  if (!registration) {
    res.status(403).json({ message: "You must be registered for this competition to submit." });
    return;
  }

  // Must be within the submission time window
  const now = new Date();
  const stage = computeStage({
    now,
    registrationStartAt: competition.registrationStartAt,
    registrationEndAt: competition.registrationEndAt,
    submissionStartAt: competition.submissionStartAt,
    submissionEndAt: competition.submissionEndAt,
    resultDate: competition.resultDate,
  });

  if (stage !== "submission_open") {
    res.status(400).json({
      message: "Submissions are not currently open for this competition.",
      currentStage: stage,
    });
    return;
  }

  try {
    const submission = await Submission.create({
      competitionId: id,
      userId,
      registrationId: registration._id,
      submissionUrl: parsed.data.submissionUrl,
      notes: parsed.data.notes,
    });

    res.status(201).json({
      message: "Submission received successfully",
      submission,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ message: "You have already submitted for this competition." });
      return;
    }

    console.error("Submission error:", err);
    res.status(500).json({ message: "Internal server error during submission" });
  }
};
