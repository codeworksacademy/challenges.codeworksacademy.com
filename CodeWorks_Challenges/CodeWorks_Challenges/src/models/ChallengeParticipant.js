import { Schema } from "mongoose";
import { SUBMISSION_TYPES } from "../constants";

const ObjectId = Schema.Types.ObjectId


export const ChallengeParticipantSchema = new Schema({
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
  submission: { type: String, maxLength: 700, default: '' },
  status: { type: String, enum: Object.keys(SUBMISSION_TYPES), required: true, default: SUBMISSION_TYPES.INCOMPLETE, uppercase: true },
  grade: { type: Number, default: 0 },
  claimedAt: { type: Date }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ChallengeParticipantSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

ChallengeParticipantSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})

ChallengeParticipantSchema.virtual('requirements', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: false,
})