import { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

export const ParticipantSchema = new Schema({

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

  moderator: {
    type: Boolean,
    required: true,
    default: false
  },
},
  { timestamps: true,
    toJSON: { virtuals: true }
  }
)

ParticipantSchema.index(
  { challengeId: 1, accountId: 1 },
  { unique: true }
)

ParticipantSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})

ParticipantSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})