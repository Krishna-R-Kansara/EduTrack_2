import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    shortName: {
        type: String,
        trim: true
    },
    courseName: {
        type: String,
        trim: true,
        default: 'General'
    },
    examName: {
        type: String,
        trim: true,
        default: 'General'
    },
    contentPdf: {
        type: String,
        trim: true
    },
    files: {
        type: [String],
        default: []
    },
    marks: {
        type: Number,
        default: 0
    },
    maxMarks: {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Subject', subjectSchema);
