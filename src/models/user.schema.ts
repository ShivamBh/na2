import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  // javascript native types, not ts types
  name: String,
  password: String,
  seller: {
    type: Boolean,
    default: false,
  },
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
    created: {
      type: Date,
      default: Date.now(),
    },
  },
});
