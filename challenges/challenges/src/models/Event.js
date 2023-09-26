import { Schema } from 'mongoose'

const ObjectId = Schema.Types.ObjectId

export const EventSchema = new Schema({

  creatorId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  roles: [
    {
      type: String,
      required: true,
      enum: [
        'admin',
        'moderator',
        'participant'
      ]
    }
  ],
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
  // sponsors: [
  //   {
  //     type: ObjectId,
  //     ref: 'Sponsor'
  //   }
  // ],
  capacity: {
    type: Number,
    required: true,
    max: 150,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: true,
    maxLength: 200
  },
  type: {
    type: String,
    required: true,
    default: 'local',
    enum: [
      'local',
      'online'
    ],
  },
  pointValue: {
    type: Number,
    required: true,
    max: 10,
    min: 1
  },
  challenges: [
    {
      type: ObjectId,
      ref: 'Challenge'
    }
  ],
  isCancelled: {
    type: Boolean,
    required: true,
    default: false
  },
  isFinished: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
})

EventSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

EventSchema.virtual('ParticipantCount', {
  localField: '_id',
  foreignField: 'eventId',
  ref: 'Participant',
  count: true
})

EventSchema.virtual('challengeCount', {
  localField: '_id',
  foreignField: 'eventId',
  ref: 'Challenge',
  count: true
})