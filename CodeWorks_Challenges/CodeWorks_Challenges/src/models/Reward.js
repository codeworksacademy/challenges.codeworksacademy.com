import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const RewardSchema = new Schema({
  challengeId:{
    type: ObjectId,
    ref: 'Challenge',
    required: true
  },
  name:{
    type: String,
    required: true
  },
  //FIXME - JAKE - I just want to be sure that I understood correctly and am removing all the correct fields for a reward before delete these fields 🤓 - AJ
  // badges:[
  //   {
  //     name: String,
  //     description: String,
  //     image: String
  //   }
  // ],
  // points:{
  //   type: Number,
  //   required: true
  // },
  // experience:{
  //   type: Number,
  //   required: true
  // },
  claimed:{
    type: Boolean,
    required: true,
    default: false
  },
  // claimedBy:{
  //   type: ObjectId,
  //   ref: 'Profile',
  //   required: true
  // },
  claimedAt:{
    type: Date
  },
},
  { timestamps: true, toJSON: { virtuals: true }
})

RewardSchema.virtual('challenge', {
  localField: 'challengeId',
  foreignField: '_id',
  ref: 'Challenge',
  justOne: true
})

RewardSchema.virtual('account', {
  localField: 'accountId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})

RewardSchema.virtual('participant', {
  localField: 'participantId',
  foreignField: '_id',
  ref: 'Participant',
  justOne: true
})