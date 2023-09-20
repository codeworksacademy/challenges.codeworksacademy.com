import { Schema } from "mongoose";
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
  coverImg: {
    type: String,
    required: true,
    maxLength: 500
  },
  supportLinks: [
    { name: String,
      url: String,
    }
  ],
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  pointValue: {
    type: Number,
    required: true,
    max: 10,
    min: 1
  },
  answers: [
    { type: String }
  ]
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