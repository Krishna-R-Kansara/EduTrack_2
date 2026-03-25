import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Module.css';

function Contact() {
    return (
        <>
            <Navbar />
            <div className="module-page">
                <div className="module-content">
                    <div className="module-header">
                        <h1>Contact Us</h1>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Contact Information */}
                        <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                            <h2 style={{ color: '#F97316', marginBottom: '20px' }}>Contact Information</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0B5ED7' }}>📍 Address</h3>
                                    <p style={{ color: '#64748B', margin: 0 }}>
                                        123 Education Street<br />
                                        Student Hub, SH 12345<br />
                                        India
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#10B981' }}>📧 Email</h3>
                                    <p style={{ color: '#64748B', margin: 0 }}>
                                        support@edutrack.com<br />
                                        info@edutrack.com
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#F59E0B' }}>📞 Phone</h3>
                                    <p style={{ color: '#64748B', margin: 0 }}>
                                        +91 1234567890<br />
                                        +91 0987654321
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0B5ED7' }}>🕐 Working Hours</h3>
                                    <p style={{ color: '#64748B', margin: 0 }}>
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>

                                <div style={{
                                    background: '#0B5ED7',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    marginTop: '16px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                                        Reach out to us anytime! ⚡
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Contact;
