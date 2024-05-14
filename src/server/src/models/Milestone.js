import { Schema } from "mongoose";

export const MilestoneSchema = new Schema({
  title: { type: String, default: 'No Title' },
  description: { type: String },
  check: { type: String },
  logic: { type: String },
  ref: { type: String }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

