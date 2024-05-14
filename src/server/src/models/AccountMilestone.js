const ObjectId = Schema.Types.ObjectId;
import { Schema } from "mongoose";

export const AccountMilestoneSchema = new Schema({
  tier: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  claimed: { type: Boolean, default: true },
  xp: { type: Number, default: 0 },
  milestoneId: { type: ObjectId, required: true, ref: 'Milestone' },
  accountId: { type: ObjectId, required: true, ref: 'Account' },
},
  { timestamps: true, toJSON: { virtuals: true } }
)

AccountMilestoneSchema.index({
  milestoneId: 1,
  accountId: 1
},
  { unique: true }
)

AccountMilestoneSchema.virtual('milestone', {
  localField: 'milestoneId',
  foreignField: '_id',
  ref: 'Milestone',
  justOne: true
})