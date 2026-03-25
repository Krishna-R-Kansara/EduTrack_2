import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Subject from '../models/Subject.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

router.get('/', authenticate, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', authenticate, upload.array('pdfFiles', 10), async (req, res) => {
    try {
        const files = [];
        
        if (req.body.contentPdf) {
            files.push(req.body.contentPdf);
        }

        if (req.files && req.files.length > 0) {
            req.files.forEach(f => files.push(`/uploads/${f.filename}`));
        }

        if (Number(req.body.marks) > Number(req.body.maxMarks || 100)) {
            return res.status(400).json({ success: false, message: 'Marks cannot exceed Max Marks' });
        }
        
        const subject = await Subject.create({
            userId: req.user._id,
            name: req.body.name,
            shortName: req.body.shortName || '',
            courseName: req.body.courseName || 'General',
            examName: req.body.examName || 'General',
            marks: req.body.marks || 0,
            maxMarks: req.body.maxMarks || 100,
            contentPdf: req.body.contentPdf || '', 
            files: files
        });
        res.status(201).json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', authenticate, upload.array('pdfFiles', 10), async (req, res) => {
    try {
        const existingSubject = await Subject.findById(req.params.id);
        if (!existingSubject || existingSubject.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        if (Number(req.body.marks) > Number(req.body.maxMarks || existingSubject.maxMarks || 100)) {
            return res.status(400).json({ success: false, message: 'Marks cannot exceed Max Marks' });
        }

        const updateData = {
            name: req.body.name,
            shortName: req.body.shortName,
            courseName: req.body.courseName,
            examName: req.body.examName,
            marks: req.body.marks,
            maxMarks: req.body.maxMarks
        };

        let newFiles = [...(existingSubject.files || [])];
        
        if (req.body.contentPdf && !newFiles.includes(req.body.contentPdf)) {
            newFiles.push(req.body.contentPdf);
        }

        if (req.files && req.files.length > 0) {
            req.files.forEach(f => newFiles.push(`/uploads/${f.filename}`));
        }

        updateData.files = newFiles;
        updateData.contentPdf = req.body.contentPdf || existingSubject.contentPdf;

        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        res.json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
