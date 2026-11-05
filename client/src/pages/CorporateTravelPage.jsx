import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Clock, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Briefcase,
  Plane,
  Check,
  Send,
  Headphones
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useBookingModal } from '../context/BookingModalContext';
import { useContactSettings } from '../context/ContactSettingsContext';

const CORPORATE_CLIENTS = [
  { name: 'AECOM', logo: '/images/AECOM.png' },
  { name: 'Aon Risk', logo: '/images/AON.png' },
  { name: 'Kwalee Gaming', logo: '/images/kwalee.jpg' },
  { name: 'Pearl Global', logo: '/images/Pearl_Global.png' },
  { name: 'PragmaEdge', logo: '/images/PragmaEdge.jpg' },
  { name: 'Nyletech', logo: '/images/Nyletech.png' },
  { name: 'Nurture Mobility', logo: '/images/Nurture_International_School.png' },
  { name: 'VR Builders', logo: '/images/VR_Builders_&_Developers.webp' }
];

export default function CorporateTravelPage() {
  const { openBookingModal } = useBookingModal();
  const { phone, phoneHref } = useContactSettings();

  const [formData, setFormData] = useState({
    company: '',
    contactPerson: '',
    phone: '',
    email: '',
    serviceRequired: 'Employee Transportation Services (ETS)',
    headcount: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      toast.error('Please provide company name, contact person and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/enquiries', {
        name: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.phone.replace(/\D/g, '')}@corp.orangecab.in`,
        subject: `Corporate RFP: ${formData.company} - ${formData.serviceRequired}`,
        message: `Company: ${formData.company}, Contact: ${formData.contactPerson}, Phone: ${formData.phone}, Headcount/Fleet: ${formData.headcount || 'Flexible'}, Service: ${formData.serviceRequired}. Notes: ${formData.notes || 'None'}`,
        source: 'corporate_page_rfp'
      });

      setSubmitted(true);
      toast.success('RFP Submitted! Our Enterprise VP will contact you within 2 hours.');
    } catch (err) {
      console.error('Corporate RFP error:', err);
      toast.error('Could not submit RFP online. Please call our corporate hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">Enterprise Mobility Services</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Corporate Transportation Solutions
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Scalable, technology-enabled employee transportation, boardroom VIP chauffeurs, and consolidated GST billing for modern enterprises.
          </p>
        </div>
      </section>

      {/* Corporate Features */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-red mb-3">Institutional Capability</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Why 100+ Corporates Partner With Orange Cars
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              We engineer enterprise mobility with zero tolerance for delays, transparent compliance, and executive hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-charcoal">100% Verified Drivers</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Comprehensive police background verification, regular substance screening, and specialized defensive highway driving certifications.
              </p>
            </div>

            <div className="luxury-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accentOrange/10 text-accentOrange flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-charcoal">Automated Rostering &amp; GPS</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Geofenced telematics, panic button SOS integration, real-time employee attendance logging, and shift synchronization.
              </p>
            </div>

            <div className="luxury-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-charcoal">Consolidated Monthly Billing</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Itemized GST invoicing, trip-by-trip analytics, transparent contract pricing, and flexible payment terms for enterprise finance teams.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* RFP Form & Dedicated Account Desk */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="badge-pill-orange">Commercial Proposal</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
                Request an Enterprise Proposal
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Connect directly with our Key Account Management Directorate to design a tailored mobility contract for your company.
              </p>

              <div className="space-y-3 pt-2 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 font-bold" />
                  <span>Customized tariffs based on daily shift volume</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 font-bold" />
                  <span>Dedicated key account manager assigned 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 font-bold" />
                  <span>Dedicated replacement cabs standby within 20 mins</span>
                </div>
              </div>

              {/* Direct Call Box */}
              <div className="p-6 rounded-2xl bg-[#101010] text-white space-y-2 mt-6">
                <span className="text-xs uppercase tracking-wider text-accentOrange font-bold block">Enterprise Hotline</span>
                <a href={phoneHref || undefined} className="text-xl font-heading font-black hover:text-accentOrange transition-colors block">
                  {phone}
                </a>
                <p className="text-xs text-gray-400">Speak directly with our VP of Corporate Mobility.</p>
              </div>
            </div>

            {/* RFP Form */}
            <div className="lg:col-span-7">
              <div className="luxury-card p-8 sm:p-10 border border-gray-200">
                
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-heading font-black text-2xl text-charcoal">Corporate RFP Submitted!</h3>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto">
                      Our Enterprise Director will review your headcount and route specifications and email a customized proposal within 2 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-outline-dark text-xs !py-2.5 !px-6"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Infosys, Bosch, Dell"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Contact Officer Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="e.g. Anand Rao (Admin Manager)"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Official Mobile *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Corporate Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. admin@company.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Mobility Solution Required</label>
                        <select
                          value={formData.serviceRequired}
                          onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none bg-white"
                        >
                          <option value="Employee Transportation Services (ETS)">Employee Transportation (ETS)</option>
                          <option value="Executive Chauffeur & Boardroom VIP">Executive Chauffeur &amp; Boardroom</option>
                          <option value="Kempegowda Airport Delegations">Kempegowda Airport Delegations</option>
                          <option value="Offsite & Conference Coaches">Offsite &amp; Conference Coaches</option>
                          <option value="Intercity Business Tours">Intercity Business Tours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Estimated Cabs / Commuters</label>
                        <input
                          type="text"
                          value={formData.headcount}
                          onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
                          placeholder="e.g. 5-10 cabs / 50 employees"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">Shift Timings &amp; Additional Notes</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. General shifts (9 AM to 6 PM) and Night shifts (11 PM drop)..."
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none resize-none"
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Strict Enterprise Confidentiality</span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary text-xs sm:text-sm !py-3 !px-7 shadow-glow-red"
                      >
                        {submitting ? 'Submitting...' : 'Send Commercial RFP'}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* Client Logos Ribbon */}
          <div className="mt-20 pt-12 border-t border-gray-200 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
              Trusted by Premier Enterprises Across Karnataka
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
              {CORPORATE_CLIENTS.map((c, i) => (
                <div key={i} className="h-16 p-2 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="max-h-10 max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<span class="text-xs font-bold text-gray-700">${c.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
