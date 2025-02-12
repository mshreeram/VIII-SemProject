const JobModel = require('../models/JobModel');
const StudentModel = require('../models/StudentModel');
const jwt = require('jsonwebtoken');

const registerStudent = async (req, res) => {
    const { domainmail, password, skills } = req.body;
    try {
        const student = await StudentModel.findOne({ domainmail: domainmail });
        console.log(domainmail);
        
        if (!student) {
            return res.status(400).json({ error: 'Student not registered, contact admin' });
        }
        if (student.password) {
            return res.status(400).json({ error: 'Student already registered! Please Login' });
        }

        student.password = password;
        student.skills = skills.split(",")

        student.save();

        res.status(201).json({
            message: `${student.domainmail} has successfully registered!`
        });

    } catch (error) {
        console.error('Error in registerStudent:', error);
        res.status(500).json({ error: error.message });
    }
};

const loginStudent = async (req, res) => {
    const { domainmail, password } = req.body;
    try {
        const student = await StudentModel.findOne({ domainmail: domainmail });
        if (!student) {
            return res.status(400).json({ error: 'No student registered with the given domain mail' });
        }

        if (!student.password) {
            return res.status(400).json({ error: 'Please register first' });
        }

        const isPasswordValid = ( password === student.password );
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await JobModel.find();
        res.status(200).json({ jobs: jobs });
    } catch (error) {
        return res.status(500);
    }
}

module.exports = { registerStudent, loginStudent, getJobs };