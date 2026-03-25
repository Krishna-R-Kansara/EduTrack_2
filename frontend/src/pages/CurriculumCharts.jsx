import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { subjectAPI } from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import '../styles/Module.css';

const COLORS = ['#0B5ED7', '#F97316', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6610f2'];

function CurriculumCharts() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
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
        loadSubjects();
    }, []);

    // Prepare Data for Charts

    // 1. Marks grouped by Exam (Bar Charts)
    const groupedByExam = subjects.reduce((acc, curr) => {
        const eName = curr.examName || 'General';
        if (!acc[eName]) acc[eName] = [];
        acc[eName].push({
            name: curr.name,
            marks: curr.marks
        });
        return acc;
    }, {});

    // 2. Average Marks by Course (Pie Chart)
    const courseStats = subjects.reduce((acc, curr) => {
        const cName = curr.courseName || 'General';
        if (!acc[cName]) {
            acc[cName] = { totalMarks: 0, count: 0 };
        }
        acc[cName].totalMarks += curr.marks || 0;
        acc[cName].count += 1;
        return acc;
    }, {});

    const avgByCourseData = Object.keys(courseStats).map(course => ({
        name: course,
        value: Number((courseStats[course].totalMarks / courseStats[course].count).toFixed(2))
    }));

    // 3. Average Marks by Exam (Line Chart)
    const examStats = subjects.reduce((acc, curr) => {
        const eName = curr.examName || 'General';
        if (!acc[eName]) {
            acc[eName] = { totalMarks: 0, count: 0 };
        }
        acc[eName].totalMarks += curr.marks || 0;
        acc[eName].count += 1;
        return acc;
    }, {});

    const avgByExamData = Object.keys(examStats).map(exam => ({
        name: exam,
        average: Number((examStats[exam].totalMarks / examStats[exam].count).toFixed(2))
    }));

    return (
        <div className="module-page" style={{ backgroundColor: 'var(--background)' }}>
            <Navbar />

            <div className="module-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="module-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '3rem' }}>📊 Performance Analytics</h1>
                    <button className="btn btn-outline" onClick={() => navigate('/curriculum')} style={{ fontSize: '1.1rem', padding: '0.6rem 1.2rem' }}>
                        &larr; Back to Curriculum
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading Charts...</p>
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3>No Data Available</h3>
                        <p>You need to add subjects and marks to view your performance charts.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/curriculum')}>
                            Go Add Records
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
                        
                        {/* 1. Bar Charts Grouped by Exam */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {Object.keys(groupedByExam).map(exam => (
                                <div key={exam} style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <h2 style={{ marginBottom: '2rem', color: 'var(--primary-blue)' }}>Scores for Exam: {exam}</h2>
                                    <div style={{ width: '100%', height: 400 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={groupedByExam[exam]} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fill: 'var(--gray-600)', fontSize: 13 }} />
                                                <YAxis tick={{ fill: 'var(--gray-600)' }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'var(--white)', color: 'var(--text-primary)' }} />
                                                <Legend verticalAlign="top" height={36}/>
                                                <Bar dataKey="marks" name={`${exam} Marks`} fill="#0B5ED7" radius={[4, 4, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Grid for Pie & Line */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                            
                            {/* Average per Course */}
                            <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', textAlign: 'center' }}>Average by Course</h2>
                                <div style={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={avgByCourseData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                outerRadius={110}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {avgByCourseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value} Marks`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'var(--white)', color: 'var(--text-primary)' }} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Average per Exam */}
                            <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', textAlign: 'center' }}>Average by Exam</h2>
                                <div style={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={avgByExamData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                                            <XAxis dataKey="name" tick={{ fill: 'var(--gray-600)', fontSize: 13 }} />
                                            <YAxis tick={{ fill: 'var(--gray-600)' }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'var(--white)', color: 'var(--text-primary)' }} formatter={(value) => `${value} Marks`} />
                                            <Legend verticalAlign="top" height={36} />
                                            <Line type="monotone" dataKey="average" name="Average Marks" stroke="#F97316" strokeWidth={4} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CurriculumCharts;
