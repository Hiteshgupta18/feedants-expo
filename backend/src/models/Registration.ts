import mongoose, { Schema, Document, Types } from "mongoose";

export type RegistrationStatus = "confirmed" | "cancelled";

export interface IRegistration extends Document {
  _id: Types.ObjectId;
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
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
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// THE critical index: one user can register for a given competition
// only once. Enforced by MongoDB itself — so even under race conditions
// / concurrent requests, a duplicate insert is rejected with a
// E11000 duplicate key error, not just caught by app logic.
RegistrationSchema.index(
  { competitionId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
