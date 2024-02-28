import { Schema } from 'mongoose';
import { CATEGORY_TYPES, STATUS_TYPES, TITLE_BGS, COLOR_FILLS } from '../constants';

const ObjectId = Schema.Types.ObjectId;
const primaryColor = '#B3B2B2';
const secondaryColor = '#242424';
export const ChallengeSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
  category: { type: String, enum: Object.values(CATEGORY_TYPES), required: true, lowercase: true },
  difficulty: { type: Number, required: true, default: 1, min: 1, max: 5 },
  status: { type: String, enum: Object.values(STATUS_TYPES), required: true, default: STATUS_TYPES.DRAFT, lowercase: true },
  coverImg: { type: String, required: true, default: 'https://codeworks.blob.core.windows.net/public/assets/img/cover_img.jpg', maxLength: 1500 },
  creatorId: { type: ObjectId, required: true, ref: 'Profile' },

  autoGrade: { type: Boolean, default: false, required: false },
  answer: { type: String, required: false },

  description: { type: String, maxLength: 85000 },
  requirements: [{ type: String }],
  supportLinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    }
  ],
  badge: {
    title: { type: String },
    image: { type: String || File },
    secondaryColor: { type: String, default: secondaryColor },
    primaryColor: { type: String, default: primaryColor },
  },
  reputationIds: [{ type: String, required: true }]
},
  { timestamps: true, toJSON: { virtuals: true }, }
)

ChallengeSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Profile',
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