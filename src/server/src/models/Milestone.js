import { Schema } from "mongoose";
import { MILESTONE_TIER } from "../constants/index.js";
const ObjectId = Schema.Types.ObjectId

export const MilestoneSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  colors: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true }
  },
  tier: {
    type: String,
    enum: Object.values(MILESTONE_TIER.map(tier => tier.ADJECTIVE)),
    required: true
  },
  difficulty: {
    type: String,
    enum: Object.values(MILESTONE_TIER.map(tier => tier.DIFFICULTY)),
    required: true
  },
  target: { type: Number, required: true },
  reward: { type: String, required: true },
},
  { timestamps: true, toJSON: { virtuals: true } }
)

