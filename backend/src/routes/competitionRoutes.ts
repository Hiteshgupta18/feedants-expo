import { Router } from "express";
import { getCompetitionById } from "../controllers/competitionController";
import { registerForCompetition } from "../controllers/registrationController";
import { createSubmission } from "../controllers/submissionController";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:id", optionalAuth, getCompetitionById);
router.post("/:id/register", requireAuth, registerForCompetition);
router.post("/:id/submission", requireAuth, createSubmission);

export default router;
