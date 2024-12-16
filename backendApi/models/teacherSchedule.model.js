const mongoose = require('mongoose');

const teacherScheduleSchema = new mongoose.Schema({
    start_time: {
        type: String, 
    },
    end_time: {
        type: String, 
    },
    classes: {
        type: mongoose.Types.ObjectId,
        ref: 'Class',
    },
    subjects: [{
        type: mongoose.Types.ObjectId, 
    }],    
    disabled: {
        type: Boolean,
        default: false,
    },
    is_inactive: {
        type: Boolean,
        default: false,
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User', 
    }
}, { timestamps: true }); 

const TeacherSchedule = mongoose.model('TeacherSchedule', teacherScheduleSchema);

module.exports = TeacherSchedule;
