import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  _id: Types.ObjectId;
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  registrationId: Types.ObjectId;
  submissionUrl: string;
  notes?: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    submissionUrl: { type: String, required: true },
    notes: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only submit once per competition
SubmissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
