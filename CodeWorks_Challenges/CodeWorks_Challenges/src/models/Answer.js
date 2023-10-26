import { Schema } from "mongoose";

// FIXME - JAKE (Please Review)

export const AnswerSchema = new Schema({
  creatorId: {type: Schema.Types.ObjectId, ref: 'Account', required: true},
  challengeId: {type: Schema.Types.ObjectId, ref: 'Challenge', required: true},
  body: {type: String, maxLength: 700, minLength: 3, required: true},
  status: {type: String, enum: ['incomplete', 'gradingPending','returnedForReview', 'gradingComplete'], required: true, default: 'incomplete'}
}, { timestamps: true, toJSON: { virtuals: true }} 
)

AnswerSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

AnswerSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})