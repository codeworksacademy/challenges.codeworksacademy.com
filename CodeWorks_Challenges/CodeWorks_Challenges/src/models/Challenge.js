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
    minLength: 3
  },
  steps: [
    { 
      type: String,
      default: []
    }
  ],
  coverImg: {
    type: String,
    required: true,
    default: 'https://i.ibb.co/b1bXrRw/card-gradient.png',
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
    default: 1,
    min: 1,
    max: 3
  },
  pointValue: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 3
  },
  badges: [
    {
      type: ObjectId,
      ref: 'Reward'
    }
  ],
  answers: [
    { 
      description: String,
      answer: String
    }
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
  },
  valid: {
    type: Boolean,
    required: true,
    default: false
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

ChallengeSchema.virtual('answerCount', {
  localField: '_id',
  foreignField: 'challengeId',
  ref: 'Answer',
  count: true
})

ChallengeSchema.virtual('event', {
  localField: '_id',
  foreignField: 'eventId',
  ref: 'Event',
  justOne: true
})