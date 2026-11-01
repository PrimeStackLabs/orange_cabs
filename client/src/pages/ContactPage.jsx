import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Clock3,
  CalendarCheck,
  Users,
  ArrowRight,
  Send, 
  MessageCircle, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Headphones
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { VEHICLE_IMAGES } from '../constants/vehicleImages';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Transport Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const contactFaqs = [
    {
      q: 'How rapidly will your dispatch team respond to inquiries?',
      a: 'Our 24/7 central command desk reviews and responds to all digital inquiries within 10 to 15 minutes, and instantly for urgent vehicle dispatches via our phone hotline.'
    },
    {
      q: 'Can I book an executive cab or airport transfer immediately via phone?',
      a: 'Yes, absolutely. Call our primary dispatch desk directly at +91 97425 88995. A duty travel manager will assign and confirm your vehicle immediately.'
    },
    {
      q: 'Where is your corporate headquarters located?',
      a: 'Our registered headquarters and central corporate mobility hub is located at Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, India.'
    },
    {
      q: 'How does corporate employee transport (ETS) onboarding work?',
      a: 'We schedule an executive consultation, review employee route shifts, set up GPS geofenced rosters, and deploy dedicated commercial fleets with centralized monthly GST invoicing.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, phone and message.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/enquiries', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.phone.replace(/\D/g, '')}@guest.orangecab.in`,
        subject: formData.subject,
        message: formData.message.trim(),
        source: 'contact_page'
      });

      if (data.success) {
        setSubmitted(true);
        toast.success('Thank you! Our travel manager will contact you promptly.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'General Transport Inquiry',
          message: ''
        });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error(err.response?.data?.message || 'Server error. Please call our hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="contact-page-hero relative overflow-hidden">
        <motion.div
          className="relative z-10 mx-auto grid min-h-[460px] max-w-[1580px] grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:min-h-[570px] lg:grid-cols-[0.94fr_1.06fr] lg:gap-10 lg:px-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD5A0] bg-[#FFF3E2] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#D94308] sm:text-xs">
              <Headphones className="h-4 w-4" />
              24/7 Dispatch &amp; Concierge
            </span>
            <h1 className="mt-5 max-w-[720px] font-heading text-4xl font-black leading-[1.02] tracking-tight text-[#171717] sm:text-5xl lg:text-[60px]">
              Connect With <span className="contact-page-hero__highlight">Our Team</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#4c5b73] sm:text-base sm:leading-7">
              For bookings, outstation plans, or corporate travel, our Bangalore team is ready to help around the clock.
            </p>
            <div className="contact-page-hero__trust mt-6 grid max-w-xl grid-cols-2 sm:grid-cols-4">
              {[
                { label: <>24/7<br />Support</>, Icon: Clock3 },
                { label: <>Quick<br />Bookings</>, Icon: CalendarCheck },
                { label: <>Dedicated<br />Travel Team</>, Icon: Users },
                { label: <>Clear Travel<br />Guidance</>, Icon: ShieldCheck },
              ].map(({ label, Icon }, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 px-1 py-2 text-center sm:border-l sm:border-gray-300 sm:first:border-0 sm:px-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0DD] text-[#F45B0B] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="text-[10px] font-bold leading-tight text-[#171717] sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+919742588995"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:px-8"
              >
                <Phone className="h-5 w-5" />
                Call our 24/7 team
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact-details"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F45B0B] px-6 py-3 text-sm font-semibold text-[#171717] transition duration-200 hover:bg-orange-50 hover:text-[#D94308]"
              >
                <Send className="h-4 w-4 text-[#F45B0B]" />
                Send an Inquiry
              </a>
            </div>
          </div>
          <div className="contact-page-hero__visual relative mx-auto h-[260px] w-full max-w-[820px] sm:h-[360px] lg:h-[460px]">
            <div className="contact-page-hero__accent" />
            <div className="contact-page-hero__photo-frame">
              <img
                src={VEHICLE_IMAGES.crysta}
                alt="Comfortable Toyota Innova ready for Orange Cars passengers"
                className="contact-page-hero__image"
              />
            </div>
            <div className="contact-page-hero__caption">
              <MapPin className="h-4 w-4 shrink-0 text-[#F45B0B]" />
              <span>Here for you, every day and every mile</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Split Grid */}
      <section id="contact-details" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Primary Direct Helpline */}
              <div className="luxury-card p-6 border-l-4 border-l-brandRed">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">24/7 Booking &amp; Dispatch Line</span>
                    <a href="tel:+919742588995" className="text-xl font-heading font-black text-charcoal hover:text-brandRed transition-colors block mt-0.5">
                      +91 97425 88995
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Instant chauffeur assignment &amp; flight delay support.</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support Card */}
              <div className="luxury-card p-6 border-l-4 border-l-accentOrange">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accentOrange/10 text-accentOrange flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Instant WhatsApp Concierge</span>
                    <a
                      href="https://wa.me/919742588995?text=Hello%20Orange%20Cab,%20I%20would%20like%20to%20inquire%20about%20a%20ride."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-heading font-black text-charcoal hover:text-accentOrange transition-colors block mt-0.5"
                    >
                      Chat on +91 97425 88995
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Get quote breakdowns and vehicle pictures in seconds.</p>
                  </div>
                </div>
              </div>

              {/* Corporate Email */}
              <div className="luxury-card p-6 border-l-4 border-l-accentOrange">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accentOrange/10 text-accentOrange flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Corporate &amp; General Inquiries</span>
                    <a href="mailto:info@orangecab.in" className="text-lg font-heading font-black text-charcoal hover:text-accentOrange transition-colors block mt-0.5">
                      info@orangecab.in
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Formal RFP proposals, invoices, and billing inquiries.</p>
                  </div>
                </div>
              </div>

              {/* Headquarters Address */}
              <div className="luxury-card p-6 border-l-4 border-l-charcoal">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-charcoal flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Central Operating Headquarters</span>
                    <strong className="text-sm font-semibold text-charcoal block mt-0.5">
                      Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, India
                    </strong>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accentOrange" />
                      <span>Command Center: 24 Hours / 7 Days a Week</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="luxury-card p-8 sm:p-10 border border-gray-200">
                
                <div className="mb-6">
                  <span className="badge-pill-red mb-2">Direct Message</span>
                  <h3 className="font-heading font-black text-2xl text-charcoal">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Fill out the form below and an Orange Cars operations manager will contact you within 15 minutes.
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="font-heading font-bold text-xl text-charcoal">Message Dispatched!</h4>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto">
                      Thank you for contacting Orange Cars. Our duty travel concierge is reviewing your request and will connect with you immediately.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-outline-dark text-xs !py-2.5 !px-6"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                          Full Name <span className="text-brandRed">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Chandra"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                          Phone Number <span className="text-brandRed">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +91 98450 12345"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. ramesh@company.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                          Subject / Inquiry Type
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all bg-white"
                        >
                          <option value="General Transport Inquiry">General Transport Inquiry</option>
                          <option value="Airport Transfer Booking">Airport Transfer Booking</option>
                          <option value="Outstation Tour Customization">Outstation Tour Customization</option>
                          <option value="Corporate Mobility RFP">Corporate Mobility RFP</option>
                          <option value="Wedding / Event Convoy">Wedding / Event Convoy</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                        Your Message / Travel Requirement <span className="text-brandRed">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please share pickup date, destination, vehicle preference, or any specific instructions..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Instant Dispatch Review</span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary text-xs sm:text-sm !py-3 !px-7 shadow-glow-red disabled:opacity-60 flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Message</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>

          {/* Quick FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="font-heading font-black text-2xl text-charcoal text-center mb-8">
              Frequently Asked Questions About Contact &amp; Dispatch
            </h3>

            <div className="space-y-4">
              {contactFaqs.map((faq, fidx) => {
                const isOpen = openFaq === fidx;
                return (
                  <div
                    key={fidx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen ? 'border-brandRed bg-brandRed/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : fidx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-heading font-bold text-sm sm:text-base text-charcoal">
                        {faq.q}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'bg-brandRed text-white rotate-180' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
