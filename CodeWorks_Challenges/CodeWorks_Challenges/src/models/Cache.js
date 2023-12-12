import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

// I dont know if I need a model yet
export const CacheSchema = new Schema({
  cacheId: {
    type: String,
    required: true,
  },
  cachedData: {
    type: Array,
    default: []
  },
  lastEmptied: {
    type: Number,
    default: Date.now()
  }
},
  { timestamps: true, toJSON: { virtuals: true } }
)