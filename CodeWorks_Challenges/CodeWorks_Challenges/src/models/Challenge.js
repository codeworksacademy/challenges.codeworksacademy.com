import { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export const ChallengeSchema = new Schema({
  creatorId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  status: {
    type: String,
    enum: ['draft', 'under-review', 'published', 'deprecated'],
    default: 'draft'
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
  supportLinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    }
  ],
  // TODO lets simply award points based on difficulty since the two were the same
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
  // REVIEW why are there multiple answers?
  //Change this to puzzles --> outputs 
  //I will be using the index of the answer in the array to compare to the index of the answer
  answers: [
    { 
      description: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ]
  // TODO respect points???
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
  ref: 'Participant',
  count: true
})

// FIXME rename answer Schema and relationships to challengeSubmission 
ChallengeSchema.virtual('completedCount', {
  localField: '_id',
  foreignField: 'challengeId',
  ref: 'Participant',
  count: true,
  match: {
    status: 'completed'
  }
})