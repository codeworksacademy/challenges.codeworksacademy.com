import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const SubmissionSchema = new Schema({
  creatorId: {type: ObjectId, ref: 'Account', required: true},
  challengeId: {type: ObjectId, ref: 'Challenge', required: true},
  supportLink: [ { name: String, url: String, description: String } ],
  status: {type: String, enum: ['incomplete', 'submitted', 'graded'], required: true, default: 'incomplete'},
  // grade: {type: Number, min: 0, max: 100},
  // gradeComment: {type: String, maxlength: 250},
  // isPassing: {type: Boolean, default: false}
}, { timestamps: true, toJSON: { virtuals: true }})

SubmissionSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

SubmissionSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})