const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    isoncampus: {
        type: Boolean,
        required: true,
    },
    jd: {
        type: String,
    },
    package: {
        type: Number,
    },
    numberofopenings: {
        type: Number,
    },
    url: {
        type: String,
    },
    adminmessage: {
        type: String,
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;