const Schedule = require("../models/scheduleRequest.model");
// const Teacher = require("../models/teacherSchedule.model");
const mongoose = require('mongoose');


exports.createScheduleRequest = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);

    // Convert fields to appropriate types and trim any whitespace
    const newSchedule = new Schedule({
      // classes: mongoose.Types.ObjectId(data.classes.trim()),
      // subject: mongoose.Types.ObjectId(data.subject.trim()),
      // chapter: mongoose.Types.ObjectId(data.chapter.trim()),
      // topic: mongoose.Types.ObjectId(data.topic.trim()),
      // studentId: mongoose.Types.ObjectId(data.studentId.trim()),
      // startTime: data.startTime, // Assuming startTime is already in a valid format
      // duration: parseInt(data.duration, 10),
      // acceptanceStatus: 'pending', // Set default status to pending
      ...data
    });

    // Save the new schedule to the database
    await newSchedule.save();
    console.log("newSchedule", newSchedule);

    // Find teachers with a matching subject ID
    // const teachers = await TeacherSchedule.find({ subjects: { $in: [data.subjectId] } });
    
    // Notify matching teachers
    // if (teachers.length > 0) {
    //   teachers.forEach((teacher) => {
    //     console.log(`Notification sent to teacher with ID: ${teacher._id}`);
    //     // Additional notification logic can be placed here
    //   });
    // }

    // Send success response
    res.status(201).json({ message: 'Schedule request created successfully and teachers notified.', schedule: newSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating schedule request', error });
  }
};




