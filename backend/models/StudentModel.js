const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regdno: {
        required: true,
        type: String,
        unique: true,
        index: true
    },
    domainmail: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    branch: {
        required: true,
        type: String
    },
    section: {
        required: true,
        type: Number
    },
    passoutyear: {
        required: true,
        type: Number
    },
    cgpa: {
        required: true,
        type: Number
    },
    email: {
        type: String
    },
    mobile: {
        type: String,
        validate: {
            validator: function(value) {
                return /^(?:\+91\s?)?[0-9]{10}$/.test(value); 
            },
            message: 'Invalid mobile number. It should be a 10-digit number, optionally prefixed with "+91" and an optional space.'
        }
    },    
    password: {
        type: String
    },
    skills: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Student', studentSchema);