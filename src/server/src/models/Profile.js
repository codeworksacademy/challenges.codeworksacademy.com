import mongoose from 'mongoose'
import { MILESTONE_TIER, RANK_TITLE, SUBMISSION_TYPES } from '../constants/index.js';
const Schema = mongoose.Schema;

export const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    nickname: { type: String, default: '' },
    bio: { type: String, default: '' },

    resume: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },

    picture: { type: String, default: 'https://codeworks.blob.core.windows.net/public/assets/img/anonymous.jpg' },
    coverImg: { type: String, default: 'https://codeworks.blob.core.windows.net/public/assets/img/cover_img.jpg' },

    xp: { type: Number, default: 0 }, // Based on challenge completion
    reputation: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }, // Based on xp + rep + milestones
    title: { type: String, enum: Object.values(RANK_TITLE).map(b => b.NAME.toLowerCase()), lowercase: true, default: 'bugs bunny' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

ProfileSchema.virtual('badges', {
  localField: '_id',
  foreignField: 'accountId',
  ref: 'Challenge_Participant',
  match: { status: SUBMISSION_TYPES.COMPLETED },
  options: {
    lean: true,
    fields: {},
    populate: {
      path: 'challenge',
      select: 'category name badge'
    }
  }
})