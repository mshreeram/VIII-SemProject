// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getStudents, addStudents, loginAdmin, addAdmin, downloadCsv, postJob } = require('../controller/controller');
const { authAdmin } = require('../middleware/authAdmin'); 
const { registerStudent, loginStudent, getJobs, addPlacementRecords } = require('../controller/studentcontroller');
const { getPlacementRecords } = require('../controller/placementcontroller');


// Ensure the "uploads" folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// File filter to allow only CSV and Excel files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /csv|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV and Excel files are allowed!'), false);
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Middleware to parse JSON bodies
router.use(express.json());

// admin routes
router.post('/addAdmin', addAdmin);
router.post('/loginAdmin', loginAdmin);
router.get('/getStudents', authAdmin, getStudents);
router.post('/addStudents', authAdmin, upload.single('file'), addStudents);
router.get('/download', downloadCsv);
router.get('/getJobs', getJobs);
router.post('/postJob', authAdmin, postJob);

// student routes
router.post('/registerStudent', registerStudent);
router.post('/loginStudent', loginStudent);
router.post('/addPlacementRecords', addPlacementRecords);

// placement routes
router.post('/getPlacementRecords', getPlacementRecords);

// Global error handler for multer errors
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ error: err.message });
    } else if (err) {
        // Other errors
        return res.status(400).json({ error: err.message });
    }
    next();
});

module.exports = router;
