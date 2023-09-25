import { Schema } from 'mongoose'

const ObjectId = Schema.Types.ObjectId

export const EventSchema = new Schema({

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
  }
})