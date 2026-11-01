import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Building2, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const POPUP_SHOWN_KEY = 'oc_quote_popup_shown';

export default function CorporateQuotePopup() {
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith('/book');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Listen for custom trigger from any "Request Corporate Proposal" button on the site
    const handleOpenProposal = () => setIsOpen(true);
    window.addEventListener('openCorporateProposal', handleOpenProposal);

    if (isBookingPage || sessionStorage.getItem(POPUP_SHOWN_KEY)) {
      return () => window.removeEventListener('openCorporateProposal', handleOpenProposal);
    }

    const timerId = window.setTimeout(() => {
      sessionStorage.setItem(POPUP_SHOWN_KEY, 'true');
      setIsOpen(true);
    }, 7000);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener('openCorporateProposal', handleOpenProposal);
    };
  }, [isBookingPage]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const company = formData.get('company')?.toString().trim();
    const person = formData.get('person')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const service = formData.get('service')?.toString();
    const count = formData.get('count')?.toString().trim();

    if (!company || !person || !phone) {
      toast.error('Please provide Company Name, Contact Person and Phone number');
      return;
    }

    setLoading(true);
    try {
      await api.post('/enquiries', {
        name: person,
        phone,
        email: email || `${phone.replace(/\D/g, '')}@corporate.orangecab.in`,
        subject: `Corporate Proposal: ${company} (${service})`,
        message: `Corporate proposal request from ${company}. Contact: ${person}, Phone: ${phone}, Service required: ${service}, Estimated Fleet/Headcount: ${count || 'Flexible'}.`,
        source: 'corporate_proposal'
      });

      setSubmitted(true);
      toast.success('Corporate Proposal requested! Our Enterprise Director will contact you within 2 hours.');

      // Also trigger WhatsApp message for convenience
      const message = encodeURIComponent(
        `*Corporate RFP Quote Request – Orange Cars*\n` +
        `• *Company:* ${company}\n` +
        `• *Contact:* ${person}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Service:* ${service}\n` +
        `• *Employees/Vehicles:* ${count || 'N/A'}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/919742588995?text=${message}`, '_blank', 'noopener,noreferrer');
      }, 1200);
    } catch (err) {
      console.error('Corporate enquiry error:', err);
      toast.error('Could not submit RFP request online. Opening direct WhatsApp line.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative my-auto w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-6 text-charcoal shadow-2xl sm:p-8"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-charcoal hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <>
                <div className="mb-6 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-pill-red">Enterprise Mobility</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">
                    Request Corporate Proposal
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Get customized enterprise rates, dedicated account management, and monthly GST invoicing for your organization.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Enterprise Name *</label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        name="company"
                        required
                        placeholder="e.g. Infosys, Wipro, Accenture"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person & Title *</label>
                      <input
                        type="text"
                        name="person"
                        required
                        placeholder="e.g. Anand Rao, Admin Head"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Official Mobile / Direct Line *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. +91 98450 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Corporate Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. travel@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Required Mobility Solution</label>
                      <select
                        name="service"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none bg-white"
                      >
                        <option value="Employee Transportation Services (ETS)">Employee Transportation (ETS)</option>
                        <option value="Executive Chauffeur & VIP Boardroom">Executive Chauffeur & VIP</option>
                        <option value="Airport Delegations & Shuttle">Airport Delegations & Shuttle</option>
                        <option value="Intercity Outstation Fleet">Intercity Outstation Fleet</option>
                        <option value="Event & Conference Shuttles">Event & Conference Shuttles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Daily Headcount / Cabs</label>
                      <input
                        type="text"
                        name="count"
                        placeholder="e.g. 20-50 employees / 5 cabs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Strict Confidentiality &amp; NDA</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary text-xs sm:text-sm !py-2.5 !px-6 shadow-glow-red"
                    >
                      {loading ? 'Submitting...' : 'Send RFP Request'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-charcoal">
                  RFP Request Received!
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Our Enterprise Key Account Manager will review your requirements and submit a commercial proposal within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline-dark text-xs !py-2.5 !px-6"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
