import { SUBMISSION_TYPES } from "../constants";
import { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const RequirementSchema = new Schema({
  description: { type: String },
  isComplete: { type: Boolean, default: false }
},
  { timestamps: true })

const FeedbackSchema = new Schema({
  comment: { type: String, maxLength: 2000 },
  moderatorId: { type: ObjectId, ref: 'Account' },
  returnedStatus: {
    type: String,
    enum: Object.values(SUBMISSION_TYPES),
    default: SUBMISSION_TYPES.STARTED,
    lowercase: true
  }
},
  { timestamps: true })

FeedbackSchema.virtual('moderator', {
  localField: 'moderatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

export const ChallengeParticipantSchema = new Schema({
  challengeId: { type: ObjectId, required: true, ref: 'Challenge' },
  accountId: { type: ObjectId, required: true, ref: 'Account' },
  submission: { type: String, maxLength: 500, default: '' }, // only saves latest submission
  requirements: [RequirementSchema],
  status: {
    type: String,
    enum: Object.values(SUBMISSION_TYPES),
    default: SUBMISSION_TYPES.STARTED,
    required: true,
    lowercase: true
  },
  feedback: [FeedbackSchema],
  completedAt: { type: Date },
  claimed: { type: Boolean, default: false }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

ChallengeParticipantSchema.index({ challengeId: 1, accountId: 1 }, { unique: true })

ChallengeParticipantSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})

ChallengeParticipantSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})