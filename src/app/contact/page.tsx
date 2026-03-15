'use client';

import { FadeIn } from '@/components/FadeIn';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { submitInquiry } from '@/app/actions/inquiryActions';
import * as React from 'react';
import styles from './contact.module.css';

export default function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('submitting');
    await submitInquiry(formData);
    setStatus('success');
    setTimeout(() => setStatus('idle'), 5000);
  }

  return (
    <div className="container section">
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="title">Get in Touch</h1>
          <p className="subtitle">Connect with R.K. Industries for bespoke manufacturing solutions and engineering excellence.</p>
        </div>
      </FadeIn>

      <div className={styles.contactGrid}>
        {/* Contact Information */}
        <FadeIn delay={0.2}>
          <div className={styles.infoSection}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '1rem' }}>Contact Information</h2>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Call Us</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <a href="tel:+919426970490" style={{ color: 'inherit', textDecoration: 'none' }}>+91 94269 70490</a>
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <a href="tel:+917990180490" style={{ color: 'inherit', textDecoration: 'none' }}>+91 79901 80490</a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Us</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  <a href="mailto:rkindustries.rjt@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>rkindustries.rjt@gmail.com</a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Visit Us</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Kailash Industrial Estate, Plot 22-25,</p>
                <p style={{ color: 'var(--text-secondary)' }}>Shed - 1, Swati park 80 feet Road,</p>
                <p style={{ color: 'var(--text-secondary)' }}>Opp. Deep Kichenware,</p>
                <p style={{ color: 'var(--text-secondary)' }}>Rajkot, Gujarat, India - 360002</p>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59085.976011424355!2d70.7613961!3d22.2448779!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b51035571bc3%3A0xea4ec5411e0d0c44!2sR.%20K.%20Industries!5e0!3m2!1sen!2sin!4v1773492406230!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </FadeIn>

        {/* Contact Form */}
        <FadeIn delay={0.4}>
          <div className={styles.formContainer}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', marginBottom: '2rem' }}>Send a Message</h2>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Message Received</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Thank you for your inquiry. A member of the R.K. Industries royal team will contact you shortly.</p>
              </div>
            ) : (
              <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Honeypot field for bot prevention */}
                <div style={{ display: 'none' }}>
                  <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>First Name</label>
                    <input type="text" name="firstName" required className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Last Name</label>
                    <input type="text" name="lastName" required className={styles.inputField} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address *</label>
                    <input type="email" name="email" required placeholder="example@mail.com" className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Mobile Number *</label>
                    <input type="tel" name="phone" required placeholder="+91 00000 00000" className={styles.inputField} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Area of Interest *</label>
                  <select name="service" required className={styles.inputField}>
                    <option value="Gearbox Manufacturing">Gearbox Manufacturing</option>
                    <option value="SPM Machines">SPM Machines</option>
                    <option value="Mini VMC">Mini VMC</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Message</label>
                  <textarea name="message" required rows={5} className={styles.inputField} style={{ resize: 'none' }}></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`btn-primary ${styles.submitButton}`}
                >
                  {status === 'submitting' ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
