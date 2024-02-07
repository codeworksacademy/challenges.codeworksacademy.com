import { Schema } from "mongoose";
import { SUBMISSION_TYPES } from "../constants";

const ObjectId = Schema.Types.ObjectId

const requirementSchema = new Schema({
  description: {
    type: String,
  },
  isComplete: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true })

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
  submission: {
    type: String,
    maxLength: 700,
    default: ''
  },
  requirements: [requirementSchema],
  status: {
    type: String,
    enum: Object.values(SUBMISSION_TYPES),
    required: true,
    default: SUBMISSION_TYPES.STARTED,
    lowercase: true
  },
  grade: {
    type: Number,
    default: 0
  },
  claimedAt: { type: Date },
  completedAt: { type: Date },
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
  justOne: true,
  
})