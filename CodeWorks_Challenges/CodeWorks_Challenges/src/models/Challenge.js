import { Schema } from 'mongoose';
import { CATEGORY_TYPES, STATUS_TYPES } from '../constants';

const ObjectId = Schema.Types.ObjectId;

export const ChallengeSchema = new Schema({
  creatorId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  category: {
    type: String,
    enum: Object.values(CATEGORY_TYPES),
    required: true,
    lowercase: true
  },

  status: {
    type: String,
    enum: Object.values(STATUS_TYPES),
    required: true,
    default: STATUS_TYPES.DRAFT,
    lowercase: true
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
    maxLength: 5000,
    minLength: 3
  },
  requirements: [
    { type: String }
  ],
  supportLinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    }
  ],
  autoGrade: {
    type: Boolean,
    default: false,
    required: false
  },
  difficulty: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5
  },
  coverImg: {
    type: String,
    required: true,
    default: 'https://i.ibb.co/b1bXrRw/card-gradient.png',
    maxLength: 500
  },
  badgeImg: {
    type: String,
    default: ''
  },
  answer: {
    type: String,
    required: false
  },
  reputationIds: [
    {type: String, required: true}
  ]
},
  {
    timestamps: true,
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
  ref: 'Challenge_Participant',
  count: true
})

ChallengeSchema.virtual('completedCount', {
  localField: '_id',
  foreignField: 'challengeId',
  ref: 'Challenge_Participant',
  count: true,
  match: {
    status: 'completed'
  }
})