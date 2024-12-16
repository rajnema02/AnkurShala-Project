const mongoose = require("mongoose");

const scheduleRequest = new mongoose.Schema({
  classes:{
    type: mongoose.Types.ObjectId,
    ref: 'class',
  },
  subject:{
      type: mongoose.Types.ObjectId,
      ref: 'subject',
  },
  chapter:{
      type: mongoose.Types.ObjectId,
      ref: 'chapter',
  },
  topic: {
    type: mongoose.Types.ObjectId,
    ref: 'topic',
  },
  studentId: {
    type: mongoose.Types.ObjectId,
  },
  acceptanceStatus:{
    type:String,
    enum: ['pending','accepted','rejected'],
  },
  startTime:{
    type:String,
  },
  duration:{
    type:Number,
  }
});

const schedule = mongoose.model("schedule", scheduleRequest);
module.exports = schedule;