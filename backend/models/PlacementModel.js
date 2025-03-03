const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    package: {
        type: Number,
        required: true
    },
    isOnCampus: {
        type: Boolean,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
});


module.exports = mongoose.model('Placement', placementSchema);