import { CompetitionStage } from "../models/Competition";

interface StageInput {
  now: Date;
  registrationStartAt: Date;
  registrationEndAt: Date;
  submissionStartAt: Date;
  submissionEndAt: Date;
  resultDate: Date;
}

export const computeStage = ({
  now,
  registrationStartAt,
  registrationEndAt,
  submissionStartAt,
  submissionEndAt,
  resultDate,
}: StageInput): CompetitionStage => {
  if (now < registrationStartAt) return "upcoming";
  if (now >= registrationStartAt && now < registrationEndAt) return "registration_open";
  if (now >= registrationEndAt && now < submissionStartAt) return "registration_closed";
  if (now >= submissionStartAt && now < submissionEndAt) return "submission_open";
  if (now >= submissionEndAt && now < resultDate) return "submission_closed";
  return "results_declared";
};
