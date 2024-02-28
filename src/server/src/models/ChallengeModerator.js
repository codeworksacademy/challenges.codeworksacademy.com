import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const ChallengeModeratorSchema = new Schema({
  challengeId: { type: ObjectId, required: true, ref: 'Challenge' },
  accountId: { type: ObjectId, required: true, ref: 'Profile' },
  originId: { type: ObjectId, ref: 'Profile' },
  status: {
    type: String,
    // Pending - The beginning of the moderation relationship that carries no privileges
    // Inactive - an account that has not participated in moderating in a long time
    // Terminated - Moderation relationship is considered Terminated
    // Banned - A more serious termination, ALL moderation relationships between user to user 'Banned'
    // Blacklisted- A more serious Banning, All moderation relationships 'Blacklisted'
    enum: ['pending', 'active', 'inactive', 'terminated', 'banned', 'blacklisted'],
    default: 'pending',
    lowercase: true
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ChallengeModeratorSchema.index({
  challengeId: 1,
  accountId: 1
}, {
  unique: true
})

ChallengeModeratorSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Profile',
  justOne: true
})

ChallengeModeratorSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})