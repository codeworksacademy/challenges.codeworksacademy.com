import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const ParticipantSchema = new Schema({
    challengeId: { 
      type: ObjectId,
      required: true,
      ref: 'Challenge'
    },
    accountId: { 
      type: ObjectId,
      required: true,
      ref: 'Account'
    },
},
    {timestamps: true, toJSON: {virtuals: true}}
)

ParticipantSchema.virtual('profile', {
    localField: 'accountId',
    foreignField: '_id',
    ref: 'Account',
    justOne: true
})

ParticipantSchema.virtual('challenge', {
    localField: 'challengeId',
    foreignField: '_id',
    ref: 'Challenge',
    justOne: true
})