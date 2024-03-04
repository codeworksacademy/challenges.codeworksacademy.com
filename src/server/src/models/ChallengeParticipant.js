import { Schema } from "mongoose";
import { SUBMISSION_TYPES } from "../constants";

const ObjectId = Schema.Types.ObjectId

const requirementSchema = new Schema({
  description: { type: String },
  isComplete: { type: Boolean, default: false }
},
  { timestamps: true })

export const ChallengeParticipantSchema = new Schema({
  challengeId: { type: ObjectId, required: true, ref: 'Challenge' },
  accountId: { type: ObjectId, required: true, ref: 'Profile' },
  submission: { type: String, maxLength: 500, default: '' },
  requirements: [requirementSchema],
  status: {
    type: String,
    enum: Object.values(SUBMISSION_TYPES),
    required: true,
    default: SUBMISSION_TYPES.STARTED,
    lowercase: true
  },
  feedback: { type: String, maxLength: 1000, default: '' },
  claimedAt: { type: Date },
  completedAt: { type: Date },
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ChallengeParticipantSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Profile',
  justOne: true
})

ChallengeParticipantSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})