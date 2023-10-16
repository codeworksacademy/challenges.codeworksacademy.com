import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const ModeratorSchema = new Schema({
  challengeId: {
    type: ObjectId,
    required: true,
    ref: 'Challenge'
  },
  accountId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  originId: {
    type: ObjectId,
    ref: 'Account'
  },
  status: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ModeratorSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

ModeratorSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})