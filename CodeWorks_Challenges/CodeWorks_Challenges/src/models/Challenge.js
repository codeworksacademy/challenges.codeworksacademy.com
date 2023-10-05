import { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export const ChallengeSchema = new Schema({
  creatorId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  name: {
    type: String,
    required: true,
    maxLength: 100,
    minLength: 3
  },
  description: {
    type: String,
    required: true,
    maxLength: 1500,
    minLength: 10
  },
  steps: [
    { type: String }
  ],
  coverImg: {
    type: String,
    required: true,
    maxLength: 500
  },
  supportLinks: [
    { 
      name: String,
      url: String,
    }
  ],
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  pointValue: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  answers: [
    { type: String }
  ],
  isCancelled: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  }
},
  { timestamps: true,
    toJSON: { virtuals: true }
  } 
)

ChallengeSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

ChallengeSchema.virtual('participantCount', {
  localField: '_id',
  foreignField: 'challengeId',
  ref: 'Participant',
  count: true
})

ChallengeSchema.virtual('event', {
  localField: '_id',
  foreignField: 'eventId',
  ref: 'Event',
  justOne: true
})