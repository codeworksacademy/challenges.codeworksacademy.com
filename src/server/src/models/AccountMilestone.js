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
    default: true
  },
  tier: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)
AccountMilestoneSchema.index({
  milestoneId: 1,
  accountId: 1
}, {
  unique: true
})

AccountMilestoneSchema.virtual('milestone', {
  localField: 'milestoneId',
  foreignField: '_id',
  ref: 'Milestone',
  justOne: true
})