import React, { useState } from 'react';
import { X, Send, Phone, User, MapPin, Calendar, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { submitEnquiry } from '../../services/api';
import { createWhatsAppQuickUrl, WHATSAPP_NUMBER } from '../../utils/whatsapp';
import './QuickEnquiryModal.css';

export default function QuickEnquiryModal({
  isOpen,
  onClose,
  prefill = {},
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    tripType: prefill.tripType || prefill.title || 'Vehicle Enquiry',
    preferredVehicle: prefill.vehicleName || prefill.preferredVehicle || '',
    pickupLocation: prefill.pickupLocation || '',
    destination: prefill.destination || '',
    preferredDate: prefill.travelDate || '',
    message: prefill.message || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile / WhatsApp number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await submitEnquiry({
        ...formData,
        customerName: formData.customerName.trim(),
        phoneNumber: cleanPhone.slice(-10),
        source: 'whatsapp_click',
      });

      setSuccessData(res);

      // Open WhatsApp with tailored message
      const waUrl = res.whatsappUrl || createWhatsAppQuickUrl(
        `Hello Vicky, I am ${formData.customerName.trim()} (Phone: ${cleanPhone.slice(-10)}). I would like to enquire about ${formData.preferredVehicle || formData.tripType || 'cab rental'}. Please share availability and best price.`
      );

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Enquiry fallback error:', err);
      // Still open WhatsApp even if network fails
      const fallbackUrl = createWhatsAppQuickUrl(
        `Hello Vicky, I would like to enquire about ${formData.preferredVehicle || formData.tripType || 'cab booking'}.`
      );
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const directUrl = createWhatsAppQuickUrl(
      prefill.vehicleName
        ? `Hello Vicky, I would like to enquire about renting the ${prefill.vehicleName}. Please share availability and rates.`
        : prefill.title
        ? `Hello Vicky, I would like to enquire about the package "${prefill.title}". Please share best pricing.`
        : 'Hello Vicky, I would like to enquire about booking a cab with SKB Tour and Travels.'
    );
    window.open(directUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="quick-enquiry-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quick-enquiry-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="quick-enquiry-header">
          <div className="quick-enquiry-title-group">
            <span className="quick-enquiry-badge">
              <MessageCircle size={14} /> Instant WhatsApp Quote
            </span>
            <h3 className="quick-enquiry-title">
              Enquire for {formData.preferredVehicle || formData.tripType || 'Cab Booking'}
            </h3>
            <p className="quick-enquiry-sub">
              Your enquiry will be saved into our priority inbox and Vicky will respond directly on WhatsApp.
            </p>
          </div>
          <button type="button" className="quick-enquiry-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {successData ? (
          <div className="quick-enquiry-success-view">
            <div className="success-icon-bubble">
              <CheckCircle2 size={44} className="text-gold" />
            </div>
            <h4>Enquiry Logged in Admin Panel!</h4>
            <p className="success-ref-text">
              Reference: <strong>{successData.enquiry?.enquiryReference || 'ENQ-RECEIVED'}</strong>
            </p>
            <p className="success-sub-text">
              WhatsApp has been opened with your details. Vicky and the SKB Travels team will reply with verified rates shortly.
            </p>
            <div className="success-actions-row">
              <a
                href={successData.whatsappUrl || `https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-reopen-wa"
              >
                <MessageCircle size={16} /> Re-open WhatsApp
              </a>
              <button type="button" className="btn-close-modal" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="quick-enquiry-form" noValidate>
            {error && (
              <div className="quick-enquiry-alert error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="enquiry-form-grid">
              {/* Customer Name */}
              <div className="enquiry-input-group">
                <label className="enquiry-label">
                  Your Full Name <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    name="customerName"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="enquiry-field-input"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="enquiry-input-group">
                <label className="enquiry-label">
                  WhatsApp / Mobile Number <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={16} className="field-icon" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="10-digit mobile (e.g. 9845012345)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="enquiry-field-input"
                    required
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="enquiry-input-group">
                <label className="enquiry-label">Pickup Location (Optional)</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="field-icon" />
                  <input
                    type="text"
                    name="pickupLocation"
                    placeholder="e.g. Indiranagar, Bengaluru or Airport"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="enquiry-field-input"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="enquiry-input-group">
                <label className="enquiry-label">Destination (Optional)</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="field-icon" />
                  <input
                    type="text"
                    name="destination"
                    placeholder="e.g. Mysore, Coorg, Local City"
                    value={formData.destination}
                    onChange={handleChange}
                    className="enquiry-field-input"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="enquiry-input-group full-width">
                <label className="enquiry-label">Preferred Travel Date (Optional)</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="field-icon" />
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="enquiry-field-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="enquiry-submit-section">
              <button
                type="submit"
                disabled={submitting}
                className="btn-enquiry-submit-whatsapp"
              >
                <MessageCircle size={18} />
                <span>{submitting ? 'Recording Enquiry...' : 'Send Enquiry & Open WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="btn-skip-to-wa"
              >
                Skip form & chat directly on WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
