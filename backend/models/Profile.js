const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema

const profileSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
    default:""
  },
  otherName: {
    type: String,
    default:""
  },
  job: {
    type: String,
    default:""
  },
  workplace: {
    type: String,
    default:""
  },
  highschool: {
    type: String,
    default:""
  },
  living: {
    type: String,
    default:""
  },
  hometown: {
    type: String,
    default:""
  },
  relationship: {
    type: String,
    default:""
  },
});

module.exports = mongoose.model("Profile", profileSchema)