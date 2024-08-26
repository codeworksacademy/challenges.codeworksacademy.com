import { Schema } from "mongoose";
import { MILESTONES } from "../constants/index.js";
const ObjectId = Schema.Types.ObjectId;

export const MilestoneSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tier: { type: String, enum: MILESTONES.map(m => m.tier), required: true },
  icon: { type: String, enum: MILESTONES.map(m => m.icon), required: true },
  difficulty: { type: String, enum: MILESTONES.map(m => m.difficulty), required: true },
  requirement: { type: Number, required: true },
  reward: { type: String, required: true },
  colors: {
    primary: { type: String, enum: MILESTONES.map(m => m.primaryColors), required: true },
    secondary: { type: String, enum: MILESTONES.map(m => m.secondaryColors), required: true }
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
);