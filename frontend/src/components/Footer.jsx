import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-logo">
                        <span style={{ color: '#0B5ED7' }}>Edu</span>
                        <span style={{ color: '#F97316' }}>Track</span>
                    </h3>
                    <p className="footer-description">
                        Your Complete Integrated Student Management System
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/curriculum">Curriculum</Link></li>
                        <li><Link to="/finance">Finance</Link></li>
                        <li><Link to="/tasks">Tasks</Link></li>
                        <li><Link to="/notes">Notes</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Resources</h4>
                    <ul className="footer-links">
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect</h4>
                    <p>📧 supportedutrack@gmail.com</p>
                    <p>📞 +91 8764066242</p>
                    <div className="social-links">
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 EduTrack. Built for students, by students. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
