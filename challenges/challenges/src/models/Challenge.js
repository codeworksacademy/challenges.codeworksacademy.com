import mongoose from "mongoose";

const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const ChallengeSchema = new Schema({
  
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
    { 
      name: String,
      url: String,
    }
  ],
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  pointValue: {
    type: Number,
    required: true,
    max: 10,
    min: 1
  },
  answers: [
    { type: String }
  ],
  isCancelled: {
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

const Challenge = model('Challenge', ChallengeSchema)

const EventSchema = new Schema({
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['local', 'online']
  }
},
  { timestamps: true,
    toJSON: { virtuals: true }
  }
)

EventSchema.virtual('challengeCount', {
  localField: '_id',
  foreignField: 'eventId',
  ref: 'Challenge',
  count: true
})

const Event = Challenge.discriminator('Event', EventSchema)

export { Challenge, Event, ChallengeSchema, EventSchema }