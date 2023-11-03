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
    type: String,
    // Pending - The beginning of the moderation relationship that carries no privileges
    // Inactive - an account that has not participated in moderating in a long time
    // Terminated - Moderation relationship is considered Terminated
    // Banned - A more serious termination, ALL moderation relationships between user to user 'Banned'
    // Blacklisted- A more serious Banning, All moderation relationships 'Blacklisted'
    enum: ['Pending', 'Active', 'Inactive', 'Terminated', 'Banned', 'BlackListed'],
    default: 'Pending'
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ModeratorSchema.index({
  challengeId: 1,
  accountId: 1
}, {
  unique: true
})

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