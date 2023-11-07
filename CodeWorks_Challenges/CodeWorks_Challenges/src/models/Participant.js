import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const SUBMISSION_TYPES = ['incomplete', 'started', 'submitted', 'returned_for_review', 'completed'];

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

  submission: { type: String, maxLength: 700, minLength: 3, default: '' },
  status: { type: String, enum: SUBMISSION_TYPES, required: true, default: 'incomplete', lowercase: true },
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