import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Phone, Mail, MapPin, Building, Globe } from 'lucide-react';
import { getSettings, updateSettings } from '../services/adminApi';

export default function Settings() {
  const [form, setForm] = useState({
    businessName: 'SKB Tour and Travels',
    ownerName: 'Vicky',
    primaryPhone: '7338140524',
    alternatePhone: '9035897960',
    whatsappNumber: '7338140524',
    contactEmail: 'vickymegha903@gmail.com',
    locationArea: 'Airport area, Devanahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560300',
    googleMapsUrl: '',
    bookingTerms: 'Fares subject to confirmation based on peak hours, toll charges and parking.',
    aboutSummary: 'SKB Tour and Travels provides premium airport transfers, outstation tours, and corporate fleet services across Bengaluru and South India with verified professional chauffeurs.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSettings();
        if (res) setForm(res);
      } catch (err) {
        console.error('Settings load error', err);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Save settings error', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h1 className="admin-page-heading">Website & Business Settings</h1>
          <p className="admin-page-sub">
            Update contact information, emergency phone lines, dispatch headquarters and terms of service.
          </p>
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {success && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '0.85rem 1.25rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle size={18} />
          <span>Website settings successfully updated and synchronized!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: 880 }}>
        <h2 className="card-title-text" style={{ marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
          Business Identity & Contact Points
        </h2>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Business Name</label>
            <input
              type="text"
              className="admin-form-input"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Proprietor / Owner Name</label>
            <input
              type="text"
              className="admin-form-input"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Primary Dispatch Phone</label>
            <input
              type="tel"
              className="admin-form-input"
              value={form.primaryPhone}
              onChange={(e) => setForm({ ...form, primaryPhone: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Alternate Booking Phone</label>
            <input
              type="tel"
              className="admin-form-input"
              value={form.alternatePhone}
              onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp Number (with country code)</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="919035897960"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Contact Email</label>
            <input
              type="email"
              className="admin-form-input"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              required
            />
          </div>
        </div>

        <h2 className="card-title-text" style={{ margin: '1.5rem 0 1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
          Physical Location & Head Office
        </h2>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label className="admin-form-label">Location Area</label>
            <input
              type="text"
              className="admin-form-input"
              value={form.locationArea}
              onChange={(e) => setForm({ ...form, locationArea: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Postal PIN Code</label>
            <input
              type="text"
              className="admin-form-input"
              value={form.pinCode}
              onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
            />
          </div>
        </div>

        <h2 className="card-title-text" style={{ margin: '1.5rem 0 1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
          Policy & Booking Information
        </h2>

        <div className="admin-form-group">
          <label className="admin-form-label">Public Booking Terms & Surcharges</label>
          <textarea
            className="admin-form-textarea"
            rows={3}
            value={form.bookingTerms}
            onChange={(e) => setForm({ ...form, bookingTerms: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">About Company Summary</label>
          <textarea
            className="admin-form-textarea"
            rows={3}
            value={form.aboutSummary}
            onChange={(e) => setForm({ ...form, aboutSummary: e.target.value })}
          />
        </div>
      </form>
    </div>
  );
}
