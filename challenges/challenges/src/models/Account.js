import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const AccountSchema = new Schema(
  {
    subs: [{ 
      type: String,
      unique: true
    }],
    email: { 
      type: String,
      lowercase: true,
      unique: true
    },
    name: { 
      type: String,
      required: true
    },
    alias: { 
      type: String,
      unique: true
    },
    coverImg: {
      type: String,
      maxLength: 500
    },
    picture: { 
      type: String,
      maxLength: 500,
    },
    age: {
      type: Number,
      maxLength: 3
    },
    bio: {
      type: String,
      maxLength: 1500
    },
    location: {
      type: String,
      maxLength: 200
    },
    experience: {
      type: Number,
      required: true,
      default: 0
    },
    reputation: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true,
    toJSON: { virtuals: true }
  }
)