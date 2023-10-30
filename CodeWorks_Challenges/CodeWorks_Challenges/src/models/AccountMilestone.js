import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const AccountMilestoneSchema = new Schema({
  milestoneId: {
    type: ObjectId,
    required: true,
    ref: 'Milestone'
  },
  accountId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  claimed: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)