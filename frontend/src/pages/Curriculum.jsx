import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { subjectAPI } from '../utils/api';
import '../styles/Module.css';

function Curriculum() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        courseName: '',
        examName: '',
        name: '',
        shortName: '', // Added Subject Short Hand
        contentPdf: '',
        marks: 0,
        maxMarks: 100, 
        pdfFiles: null
    });

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await subjectAPI.getAll();
            if (response.success) {
                setSubjects(response.data);
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleAddForCourse = (courseName) => {
        setFormData({ ...formData, courseName });
        setCurrentStep(2); 
        setShowModal(true);
    };

    const handleAddForExam = (courseName, examName) => {
        const existingExamContext = subjects.find(s => s.courseName === courseName && s.examName === examName);
        const autoMaxMarks = existingExamContext ? existingExamContext.maxMarks : 100;

        setFormData({ ...formData, courseName, examName, maxMarks: autoMaxMarks });
        setCurrentStep(3); 
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.marks > formData.maxMarks) {
            alert(`Oops! The marks scored (${formData.marks}) cannot exceed the maximum marks (${formData.maxMarks}). Please fix them before saving.`);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('courseName', formData.courseName);
            submitData.append('examName', formData.examName);
            submitData.append('name', formData.name);
            submitData.append('shortName', formData.shortName); // Append Shortname
            submitData.append('marks', formData.marks);
            submitData.append('maxMarks', formData.maxMarks);
            
            if (formData.pdfFiles && formData.pdfFiles.length > 0) {
                Array.from(formData.pdfFiles).forEach(file => {
                    submitData.append('pdfFiles', file);
                });
            }
            if (formData.contentPdf) {
                submitData.append('contentPdf', formData.contentPdf);
            }

            if (editingId) {
                await subjectAPI.update(editingId, submitData, true);
            } else {
                await subjectAPI.create(submitData, true);
            }
            loadSubjects();
            closeModal();
        } catch (error) {
            console.error('Error saving subject:', error);
            alert('Failed to save subject. Make sure marks do not exceed max marks!');
        }
    };

    const handleEdit = (subject) => {
        setEditingId(subject._id);
        setCurrentStep(1); 
        setFormData({
            courseName: subject.courseName || '',
            examName: subject.examName || '',
            name: subject.name,
            shortName: subject.shortName || '', // Edit Shortname
            contentPdf: '',
            marks: subject.marks || 0,
            maxMarks: subject.maxMarks || 100,
            pdfFiles: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await subjectAPI.delete(id);
                loadSubjects();
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentStep(1);
        setEditingId(null);
        setFormData({
            courseName: '',
            examName: '',
            name: '',
            shortName: '', // Reset Shorthand
            contentPdf: '',
            marks: 0,
            maxMarks: 100,
            pdfFiles: null
        });
    };

    const getFileUrl = (pdfPath) => {
        if (!pdfPath) return '#';
        if (pdfPath.startsWith('http')) return pdfPath;
        if (pdfPath.startsWith('/uploads')) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const serverUrl = apiUrl.replace('/api', '');
            return `${serverUrl}${pdfPath}`;
        }
        return `https://${pdfPath}`;
    };

    const renderGroupedSubjects = () => {
        const grouped = subjects.reduce((acc, current) => {
            const cName = current.courseName || 'General';
            const eName = current.examName || 'General';
            if (!acc[cName]) acc[cName] = {};
            if (!acc[cName][eName]) acc[cName][eName] = [];
            acc[cName][eName].push(current);
            return acc;
        }, {});

        if (Object.keys(grouped).length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>No Curriculum Yet</h3>
                    <p>Start tracking your courses, exams, subjects, marks, and study materials.</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        Add Your First Record
                    </button>
                </div>
            );
        }

        return Object.keys(grouped).map(course => (
            <div key={course} className="course-group" style={{ marginBottom: '3rem', backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--primary-blue)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: 0 }}>{course}</h2>
                    <button className="btn btn-outline" onClick={() => handleAddForCourse(course)}>+ Add Exam for {course}</button>
                </div>
                
                {Object.keys(grouped[course]).map(exam => (
                    <div key={exam} className="exam-group" style={{ marginLeft: '1.5rem', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-200)' }}>
                            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-orange)', margin: 0 }}>{exam}</h3>
                            <button className="btn btn-sm btn-primary" onClick={() => handleAddForExam(course, exam)}>+ Add Subject to {exam}</button>
                        </div>
                        
                        <div className="data-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Subject Name</th>
                                        <th>Study Materials</th>
                                        <th>Marks</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grouped[course][exam].map(subject => (
                                        <tr key={subject._id}>
                                            <td>
                                                <strong style={{ fontSize: '1.1rem' }}>{subject.name}</strong>
                                                {' '}
                                                {subject.shortName && (
                                                    <span style={{ fontSize: '0.9rem', color: '#666', opacity: 0.8 }}>({subject.shortName.toUpperCase()})</span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    {subject.files && subject.files.length > 0 ? (
                                                        subject.files.map((file, idx) => (
                                                            <a key={idx} href={getFileUrl(file)} target="_blank" rel="noopener noreferrer" style={{ color: '#0B5ED7', textDecoration: 'underline', fontSize: '0.95rem' }}>
                                                                📎 Open File {idx + 1}
                                                            </a>
                                                        ))
                                                    ) : subject.contentPdf ? (
                                                        <a href={getFileUrl(subject.contentPdf)} target="_blank" rel="noopener noreferrer" style={{ color: '#0B5ED7', textDecoration: 'underline', fontSize: '0.95rem' }}>
                                                            📎 View Resource
                                                        </a>
                                                    ) : <span style={{ color: '#999' }}>No files attached</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-success" style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}>
                                                    {subject.marks} <span style={{opacity: 0.8, fontSize: '0.8rem'}}>/ {subject.maxMarks || 100}</span>
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(subject)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subject._id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="module-page" style={{ backgroundColor: 'var(--background)' }}>
            <Navbar />

            <div className="module-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="module-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '3rem' }}>📚 Academic Tracker</h1>
                    <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '0.8rem 1.5rem' }} onClick={() => setShowModal(true)}>
                        + Add Entirely New Record
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div>
                        {renderGroupedSubjects()}
                        
                        <div style={{ marginTop: '3rem', textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '2rem', color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Want to visualize your performance?</h3>
                            <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', backgroundColor: '#F97316', borderColor: '#F97316' }} onClick={() => window.location.href='/curriculum/charts'}>
                                📊 View Performance Analytics
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal} style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                {editingId ? 'Edit Record' : 'Add New Record'} 
                                <span style={{fontSize: '1rem', color: '#666', marginLeft: '1rem', fontWeight: 'normal'}}>
                                    (Step {currentStep} of 3)
                                </span>
                            </h2>
                            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                                
                                {currentStep === 1 && (
                                    <div className="form-step slide-in">
                                        <h3 style={{ color: '#0B5ED7' }}>Step 1: Course Information</h3>
                                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Enter the primary grouping (e.g. 6th Sem, Fall 2024, GATE Prep)</p>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Course Name</label>
                                            <input
                                                type="text"
                                                value={formData.courseName}
                                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                                placeholder="e.g. 6th Sem"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="form-step slide-in">
                                        <h3 style={{ color: '#F97316' }}>Step 2: Exam Information</h3>
                                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Enter the specific exam or categorization for this course (e.g. Midterm 1, Formative Assessment)</p>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Exam Name</label>
                                            <input
                                                type="text"
                                                value={formData.examName}
                                                onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                                placeholder="e.g. Internal Exam 1"
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Max Marks Possible for this Exam</label>
                                            <input
                                                type="number"
                                                value={formData.maxMarks}
                                                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="form-step slide-in">
                                        <h3>Step 3: Subject Details</h3>
                                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Details regarding the specific subject tested.</p>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Subject Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Ethical Hacking"
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>Subject Short Hand (Optional)</label>
                                            <input
                                                type="text"
                                                value={formData.shortName}
                                                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                                                placeholder="e.g. EH"
                                            />
                                        </div>
                                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--gray-100)', padding: '1rem', borderRadius: '8px' }}>
                                            <div>
                                                <label style={{ fontWeight: 'bold' }}>Upload Multiple Documents (PDF, Images)</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => setFormData({ ...formData, pdfFiles: e.target.files, contentPdf: '' })}
                                                    accept=".pdf,.png,.jpeg,.jpg"
                                                    style={{ marginTop: '0.5rem', width: '100%' }}
                                                />
                                            </div>
                                            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>OR</div>
                                            <div>
                                                <label>External PDF / Resource URL</label>
                                                <input
                                                    type="text"
                                                    value={formData.contentPdf}
                                                    onChange={(e) => setFormData({ ...formData, contentPdf: e.target.value, pdfFiles: null })}
                                                    placeholder="e.g. drive.google.com/..."
                                                    disabled={formData.pdfFiles && formData.pdfFiles.length > 0}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Marks Scored (out of {formData.maxMarks})</label>
                                            <input
                                                type="number"
                                                value={formData.marks}
                                                onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                                                min="0"
                                                max={formData.maxMarks}
                                                style={{ fontSize: '1.2rem', borderColor: formData.marks > formData.maxMarks ? 'red' : '' }}
                                                required
                                            />
                                            {formData.marks > formData.maxMarks && (
                                                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                                    Marks scored cannot exceed the max marks ({formData.maxMarks}).
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-buttons" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {currentStep === 1 ? (
                                        <button type="button" className="btn btn-outline" onClick={closeModal} style={{ padding: '0.6rem 1.5rem' }}>
                                            Cancel
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-outline" onClick={prevStep} style={{ padding: '0.6rem 1.5rem' }}>
                                            &larr; Back
                                        </button>
                                    )}

                                    {currentStep < 3 ? (
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2.5rem', fontSize: '1.1rem' }}>
                                            Next &rarr;
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#28a745', borderColor: '#28a745', padding: '0.6rem 2.5rem', fontSize: '1.1rem' }} disabled={formData.marks > formData.maxMarks}>
                                            {editingId ? 'Update Subject' : 'Save Subject'} ✓
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Curriculum;
