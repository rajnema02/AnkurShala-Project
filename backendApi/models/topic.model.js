const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    class:{
        type: mongoose.Types.ObjectId,
        ref: 'Class',
    },
    subject:{
        type: mongoose.Types.ObjectId,
        ref: 'Subject',
    },
    chapter:{
        type: mongoose.Types.ObjectId,
        ref: 'Chapter',
    },
    time:{
        type:String,

    },
    summary:{
        type: String,
    },
   
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
        ref: 'User', // Assuming 'User' is the model for your users
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the model for your users
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
