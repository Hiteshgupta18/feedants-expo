import mongoose, { Schema, Document, Types } from "mongoose";

export type CompetitionStage =
  | "upcoming"
  | "registration_open"
  | "registration_closed"
  | "submission_open"
  | "submission_closed"
  | "results_declared";

export interface IJudge {
  name: string;
  title: string;
  experience: string;
  photoUrl: string;
  introVideoUrl?: string;
}

export interface IReward {
  position: number;
  label: string;
  amount: number;
}

export interface IPreviousWinner {
  name: string;
  position: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

export interface ICompetition extends Document {
  _id: Types.ObjectId;
  title: string;
  tags: string[];
  category: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  judge: IJudge;
  registrationStartAt: Date;
  registrationEndAt: Date;
  submissionStartAt: Date;
  submissionEndAt: Date;
  resultDate: Date;
  previousWinners: IPreviousWinner[];
  aboutText: string;
  judgingParameters: string[];
  rulesAndEligibility: string[];
  rewards: IReward[];
  disclaimer?: string;
  refundPolicyUrl?: string;
  createdAt: Date;
}

const CompetitionSchema = new Schema<ICompetition>(
  {
    title: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    totalSpots: { type: Number, required: true, min: 1 },
    bookedSpots: { type: Number, required: true, default: 0, min: 0 },
    judge: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      experience: { type: String, required: true },
      photoUrl: { type: String, required: true },
      introVideoUrl: { type: String },
    },
    registrationStartAt: { type: Date, required: true },
    registrationEndAt: { type: Date, required: true },
    submissionStartAt: { type: Date, required: true },
    submissionEndAt: { type: Date, required: true },
    resultDate: { type: Date, required: true },
    previousWinners: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String },
      },
    ],
    aboutText: { type: String, default: "" },
    judgingParameters: [{ type: String }],
    rulesAndEligibility: [{ type: String }],
    rewards: [
      {
        position: { type: Number, required: true },
        label: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    disclaimer: { type: String },
    refundPolicyUrl: { type: String },
  },
  { timestamps: true }
);

// Guard: bookedSpots should never exceed totalSpots (defense in depth,
// on top of the atomic query condition used in the register endpoint).
// No `next` callback — this Mongoose version treats hooks as
// promise-based; throwing an Error aborts the save.
CompetitionSchema.pre("save", function () {
  if (this.bookedSpots > this.totalSpots) {
    throw new Error("bookedSpots cannot exceed totalSpots");
  }
});

export default mongoose.model<ICompetition>("Competition", CompetitionSchema);
