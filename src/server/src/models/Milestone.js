import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const MilestoneSchema = new Schema({
  title: {
    type: String,
    default: 'No Title'
  },
  description: {
    type: String
  },
  check: {
    type: String
  },
  logic: {
    type: String
  },
  ref: {
    type: String
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

