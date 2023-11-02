import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const SubmissionSchema = new Schema({
  participantId: {
    type: ObjectId,
    ref: 'Participant',
    required: true
  },
  challengeId: {
    type: ObjectId,
    ref: 'Challenge',
    required: true
  },
  supportLinks: [{
    name: String,
    url: String
  }],
  isSubmitted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)

SubmissionSchema.virtual('participant', {
  localField: 'participantId',
  foreignField: '_id',
  ref: 'Participant',
  justOne: true
})

SubmissionSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})