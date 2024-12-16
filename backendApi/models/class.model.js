const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    description: {
        type: String,
   
    },
    image: {
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
        
    },
    updated_by: {
        type: mongoose.Types.ObjectId,
       
    }
}, { timestamps: true }); 

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
