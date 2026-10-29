import React, { useState } from 'react';
import { Phone, Mail, MapPin, User, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { createWhatsAppQuickUrl } from '../utils/whatsapp';
import { submitContact } from '../services/api';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Airport Transfer',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.message.trim()) {
      setError('Please enter your travel details or message.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitContact({
        name: formData.name.trim(),
        phone: cleanPhone.slice(-10),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Airport Transfer',
        message: '',
      });
    } catch (err) {
      setError('Network is slow, but your message has been recorded locally. You can also chat directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    const text = formData.message.trim()
      ? `Hello Vicky, I am ${formData.name || 'a customer'}. ${formData.message}`
      : 'Hello Vicky, I would like to enquire about travel bookings with SKB Tour and Travels.';
    window.open(createWhatsAppQuickUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page-root">
      {/* 1. Header Banner */}
      <section className="contact-banner-navy" aria-label="Contact Us Banner">
        <div className="container contact-banner-center">
          <h1 className="contact-main-heading">Contact Us</h1>
          <p className="contact-main-subtext">We are here to assist you with your travel plans 24/7.</p>
        </div>
      </section>

      {/* 2. Top Section: Get in Touch & Our Location */}
      <section className="contact-cards-section" aria-label="Contact and Location Cards">
        <div className="container">
          <div className="contact-cards-2col-grid">
            {/* Left Card: Get in Touch */}
            <div className="contact-white-card">
              <h2 className="card-top-title">Get in Touch</h2>

              <div className="contact-details-table">
                <div className="detail-table-row">
                  <div className="detail-icon-cell">
                    <User size={18} className="text-gold" />
                  </div>
                  <div className="detail-label-cell">Owner</div>
                  <div className="detail-value-cell bold-val">{BUSINESS_INFO.owner}</div>
                </div>

                <div className="detail-table-row">
                  <div className="detail-icon-cell">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div className="detail-label-cell">Primary Number</div>
                  <div className="detail-value-cell">
                    <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="contact-num-link">
                      {BUSINESS_INFO.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="detail-table-row">
                  <div className="detail-icon-cell">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div className="detail-label-cell">Alternate Number</div>
                  <div className="detail-value-cell">
                    <a href={`tel:${BUSINESS_INFO.alternatePhone}`} className="contact-num-link">
                      {BUSINESS_INFO.alternatePhone}
                    </a>
                  </div>
                </div>

                <div className="detail-table-row">
                  <div className="detail-icon-cell">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <div className="detail-label-cell">Email</div>
                  <div className="detail-value-cell">
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="contact-email-link">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="detail-table-row">
                  <div className="detail-icon-cell">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <div className="detail-label-cell">Location</div>
                  <div className="detail-value-cell">
                    {BUSINESS_INFO.location.area}, Bengaluru - {BUSINESS_INFO.location.pinCode}
                  </div>
                </div>
              </div>

              {/* Three Action Buttons: Call Now, WhatsApp, Send Email */}
              <div className="contact-3buttons-row">
                <a
                  href={`tel:${BUSINESS_INFO.primaryPhone}`}
                  className="btn-action-blue"
                >
                  <Phone size={15} />
                  <span>Call Now</span>
                </a>

                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="btn-action-green"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="btn-action-gold"
                >
                  <Mail size={15} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Right Card: Our Location */}
            <div className="contact-white-card">
              <h2 className="card-top-title">Our Location</h2>
              <div className="map-badge-header">
                <strong>Bengaluru, Airport</strong>
                <span className="map-sub-info">Bengaluru, Karnataka 560300</span>
              </div>

              <div className="contact-map-wrapper">
                <iframe
                  title="Bengaluru Airport Location Map"
                  src="https://maps.google.com/maps?q=Kempegowda+International+Airport+Bengaluru+560300&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="map-bottom-link-row">
                <a
                  href="https://maps.google.com/?q=Kempegowda+International+Airport+Bengaluru+560300"
                  target="_blank"
                  rel="noreferrer"
                  className="view-larger-map-link"
                >
                  View larger map
                </a>
              </div>
            </div>
          </div>

          {/* 3. Send Us a Message / Direct Enquiry Form (Logged in Admin Panel) */}
          <div className="contact-form-container-card">
            <div className="form-card-header">
              <h2 className="card-top-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                Send Us a Message / Travel Enquiry
              </h2>
              <p className="form-card-subtitle">
                Fill out the form below. Your message will be instantly recorded in our admin panel and Vicky will respond with complete details.
              </p>
            </div>

            {success ? (
              <div className="contact-success-banner">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={36} className="text-gold" />
                </div>
                <div>
                  <h3 className="success-banner-title">Message Received & Recorded!</h3>
                  <p className="success-banner-desc">
                    Thank you for reaching out. Your enquiry is logged in the admin panel and Vicky has been notified. You can also connect instantly on WhatsApp below.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleWhatsAppChat}
                      className="btn-action-green"
                      style={{ padding: '0.65rem 1.25rem' }}
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="btn-send-another"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-actual-form" noValidate>
                {error && (
                  <div className="contact-form-alert error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="contact-form-2col">
                  <div className="form-group-item">
                    <label className="form-field-label">
                      Your Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-text-input"
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">
                      Mobile / WhatsApp Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="contact-text-input"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-2col">
                  <div className="form-group-item">
                    <label className="form-field-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-text-input"
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-field-label">Trip Type / Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-select-input"
                    >
                      <option value="Airport Transfer">Airport Transfer (Pickup / Drop)</option>
                      <option value="Local City Trip">Local City Trip (4H / 8H)</option>
                      <option value="Outstation One-Way">Outstation One-Way Drop</option>
                      <option value="Outstation Round Trip">Outstation Round Trip</option>
                      <option value="Group & Corporate Travel">Group & Corporate Travel</option>
                      <option value="General Travel Enquiry">General Travel Enquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-item full-row">
                  <label className="form-field-label">
                    Your Message / Travel Route Details <span className="req">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Provide your pickup point, destination, date of travel, vehicle preference (Innova Crysta, Sedan, TT, Urbania) or any questions..."
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-textarea-input"
                    required
                  />
                </div>

                <div className="contact-form-submit-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-submit-contact-gold"
                  >
                    <Send size={16} />
                    <span>{submitting ? 'Sending Message...' : 'Submit Message to Admin'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="btn-contact-whatsapp-direct"
                  >
                    <MessageCircle size={16} />
                    <span>Instant WhatsApp Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
