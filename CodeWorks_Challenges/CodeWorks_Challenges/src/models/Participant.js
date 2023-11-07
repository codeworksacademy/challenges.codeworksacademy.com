import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

<<<<<<< HEAD
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

=======
export const ParticipantSchema = new Schema({
    challengeId: { 
      type: ObjectId,
      required: true,
      ref: 'Challenge'
    },
    //FIXME - JAKE - So the below field can be deleted? We do not need this, correct? - AJ
    // status: {
    //   type: String,
    //   enum: ['registered', 'submitted', 'graded', 'completed', 'failed', 'inactive'],
    //   required: true
    // },
    accountId: { 
      type: ObjectId,
      required: true,
      ref: 'Account'
    },
>>>>>>> 9337487010152b54d5695a0e414ade387c90b454
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