import mongoose from 'mongoose'
import { MILESTONE_BADGE, RANK_BADGE } from '../constants/index.js';
const Schema = mongoose.Schema;

export const AccountSchema = new Schema(
  {
    subs: [{ type: String, unique: true }],
    email: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    // NOTE If you wish to add additional properties do so here
    coverImg: { type: String },
    aboutContent: { type: String },
    experience: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    title: { type: String, enum: Object.values(RANK_BADGE).map(b => b.NAME), default: 'Bugs Bunny',
     lowercase: true },
    badges: [{ type: String }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
)