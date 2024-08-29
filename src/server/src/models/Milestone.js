import { Schema } from "mongoose";
import { MILESTONES } from "../constants/index.js";
const ObjectId = Schema.Types.ObjectId;

export const MilestoneSchema = new Schema({
  accountId: { type: ObjectId, required: true, ref: 'Account' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  //tier: { type: String, enum: MILESTONES.map(m => m.tier), required: true },
  tier: { type: Number, default: 0 },
  check: { type: String },
  logic: { type: String },
  difficulty: { type: String, enum: MILESTONES.map(m => m.difficulty), required: true },
  icon: { type: String, enum: MILESTONES.map(m => m.icon), required: true },
  count: { type: Number, default: 0 },
  reward: { type: String, required: true },
  colors: {
    primary: { type: String, enum: MILESTONES.map(m => m.primaryColors), required: true },
    secondary: { type: String, enum: MILESTONES.map(m => m.secondaryColors), required: true }
  },
  claimed: { type: Boolean, default: false },
},
  { timestamps: true, toJSON: { virtuals: true } }
);

MilestoneSchema.index({ accountId: 1, check: 1 }, { unique: true });
