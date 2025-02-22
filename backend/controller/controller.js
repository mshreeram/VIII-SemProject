const StudentModel = require('../models/StudentModel');
const AdminModel = require('../models/AdminModel');
const JobModel = require('../models/JobModel');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { parse } = require('json2csv');

const addAdmin = async (req, res) => {
    const admins = [{
        username: "admin1",
        password: "admin1@123"
    },
    {
        username: "admin2",
        password: "admin2@123"
    }]
    try {
        const savedAdmins = await AdminModel.insertMany(admins);
        res.status(201).json({
            message: `${admins.length} admins added successfully`,
            data: admins
        });
    } catch (error) {
        console.error('Error in addAdmins:', error);
        res.status(500).json({ error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await AdminModel.findOne({ username: username });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = (password === admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        let filter = {};
        let search = req.query.search || '';

        if (req.query.filter) {
            const { branch } = req.query;

            if (branch) {
                // If branch is an array, filter by all selected branches
                if (Array.isArray(branch)) {
                    filter.$or = branch.map(b => ({ branch: b }));
                } else {
                    // If branch is a single value, filter by that value
                    filter.branch = branch;
                }
            }
        }

        // Search functionality (search by regdno and name)
        if (search) {
            filter.$or = [
                { regdno: { $regex: search, $options: 'i' } }, // Case-insensitive search on regdno
                { name: { $regex: search, $options: 'i' } }     // Case-insensitive search on name
            ];
        }


        // Pagination and fetching students
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        let studentData;
        if(Object.keys(filter).length !== 0) {
            studentData = await StudentModel.find(filter)
        } else {
            studentData = await StudentModel.find()
                .skip(skip)
                .limit(limit);
        }

        const totalCount = await StudentModel.countDocuments(filter);

        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            students: studentData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        let students = [];
        let skippedRecords = [];

        const validBranches = ['cse', 'csm', 'csd', 'civil', 'chem', 'ece', 'eee', 'it', 'mech', 'mrb'];
        const currentYear = new Date().getFullYear();

        const validateStudent = (student) => {
            if (!/^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/.test(student.domainmail)) {
                return `Invalid domainmail: ${student.domainmail}`;
            }
            if (!validBranches.includes(student.branch?.toLowerCase())) {
                return `Invalid branch: ${student.branch}`;
            }
            if (!(Number(student.section) >= 1 && Number(student.section) <= 4)) {
                return `Invalid section: ${student.section}`;
            }
            if (!(Number(student.passoutyear) > 2000 && Number(student.passoutyear) <= currentYear + 4)) {
                return `Invalid passoutyear: ${student.passoutyear}`;
            }
            if (!(Number(student.cgpa) >= 0 && Number(student.cgpa) <= 10)) {
                return `Invalid cgpa: ${student.cgpa}`;
            }
            return null;
        };

        if (fileExt === '.csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        const student = {
                            regdno: row.regdno,
                            domainmail: row.domainmail,
                            name: row.name,
                            branch: row.branch?.toLowerCase(),
                            section: row.section,
                            passoutyear: row.passoutyear,
                            cgpa: row.cgpa,
                            email: row.email,
                        };

                        const validationError = validateStudent(student);
                        if (validationError) {
                            skippedRecords.push(`Record with regdno: ${row.regdno || 'unknown'} skipped. Reason: ${validationError}`);
                        } else {
                            students.push(student);
                        }
                    })
                    .on('end', () => {
                        console.log('CSV file successfully processed');
                        resolve();
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });
        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            jsonData.forEach(row => {
                const student = {
                    regdno: row.regdno,
                    domainmail: row.domainmail,
                    name: row.name,
                    branch: row.branch?.toLowerCase(),
                    section: row.section,
                    passoutyear: row.passoutyear,
                    cgpa: row.cgpa,
                    email: row.email,
                };

                const validationError = validateStudent(student);
                if (validationError) {
                    skippedRecords.push(`Record with regdno: ${row.regdno || 'unknown'} skipped. Reason: ${validationError}`);
                } else {
                    students.push(student);
                }
            });

            console.log('Excel file successfully processed');
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        const savedStudents = await StudentModel.insertMany(students);

        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting the file:', err);
            else console.log('Uploaded file deleted');
        });

        console.log(skippedRecords);
        
        res.status(201).json({
            message: `${students.length} Students added successfully`,
            data: savedStudents,
            skipped: skippedRecords,
        });
    } catch (error) {
        console.error('Error in addStudents:', error);
        res.status(500).json({ error: error.message });
    }
};

const downloadCsv = async (req, res) => {
    try {
        let filter = {};
        const { branch } = req.query;

        if (branch) {
            if (Array.isArray(branch)) {
                filter.$or = branch.map(b => ({ branch: b }));
            } else {
                filter.branch = branch;
            }
        }

        const studentData = await StudentModel.find(filter);

        if (studentData.length === 0) {
            return res.status(404).json({ message: 'No students found matching the filter criteria' });
        }

        const fields = ['regdno', 'name', 'branch', 'cgpa', 'passoutyear', 'email'];
        const csvData = parse(studentData, { fields });


        const tempDir = path.resolve(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `students_${Date.now()}.csv`);

        try {
            fs.writeFileSync(tempFilePath, csvData);
        } catch (writeError) {
            console.error('Error writing the file:', writeError);
            return res.status(500).json({ message: 'Error creating the CSV file' });
        }

        if (!fs.existsSync(tempFilePath)) {
            throw new Error('File was not created');
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=students.csv`);
        res.download(tempFilePath, (err) => {
            if (err) {
                console.error('Error while sending the file:', err);
                res.status(500).send('Error while sending the file');
            }
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temporary file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Error in downloadCsv:', error);
        res.status(500).json({ message: error.message });
    }
};

const postJob = async (req, res) => {
    try {
        const job = req.body;
        if (!job.companyname || !job.role) {
            return res.status(400).json({ message: "Please provide proper details of job" })
        }
        const { companyname, role, isoncampus, jd, package, numberofopenings, url, adminmessage } = req.body;
        console.log(companyname, role, isoncampus, jd, package, numberofopenings, url, adminmessage);
        
        const savedJob = await JobModel.create(job);
        return res.status(200).json({ message: "success inserted job" })

    } catch (error) {
        return res.status(500);
    }
}

module.exports = { getStudents, addStudents, loginAdmin, addAdmin, downloadCsv, postJob };
