import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  ArrowUp, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ShieldCheck,
  Car,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

export default function FloatingWidgets() {
  const { openBookingModal } = useBookingModal();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Orange Cars. I am your 24/7 Mobility Concierge. How may I assist your travel today?',
      quickReplies: [
        { label: 'Book a Ride', action: 'book' },
        { label: 'Airport Transfers', action: 'airport' },
        { label: 'Corporate Fleet Inquiries', action: 'corporate' },
        { label: 'Call 24/7 Dispatch', action: 'call' }
      ],
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const messageThreadRef = useRef(null);

  useEffect(() => {
    const thread = messageThreadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickReply = (action) => {
    if (action === 'book') {
      setIsChatOpen(false);
      openBookingModal();
    } else if (action === 'airport') {
      setIsChatOpen(false);
      openBookingModal({ serviceType: 'Airport Transfer', drop: 'Kempegowda Int. Airport (BLR)' });
    } else if (action === 'corporate') {
      setIsChatOpen(false);
      window.dispatchEvent(new CustomEvent('openCorporateProposal'));
    } else if (action === 'call') {
      window.location.href = 'tel:+919742588995';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const normalizedText = userText.toLowerCase();
    setInputText('');
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' }
    ]);

    setTimeout(() => {
      let reply = 'Thanks for your message. Tell me your pickup city, destination, and travel date, and I can help you get started.';
      let quickReplies = [
        { label: 'Book a Ride', action: 'book' },
        { label: 'Call 24/7 Dispatch', action: 'call' }
      ];

      if (/\b(price|prices|rate|rates|fare|cost|pricing)\b/.test(normalizedText)) {
        reply = 'You can view the current starting rates in Our Fleet. Your final fare depends on the selected vehicle and trip details; the confirmed quote will show applicable charges before travel.';
        quickReplies = [
          { label: 'Book a Ride', action: 'book' },
          { label: 'Call for a Quote', action: 'call' }
        ];
      } else if (/\b(airport|flight|terminal|blr)\b/.test(normalizedText)) {
        reply = 'We can help with Kempegowda International Airport (BLR) transfers. Share your pickup location and flight or pickup time, or start a booking and choose Airport Pickup & Drop.';
        quickReplies = [
          { label: 'Book Airport Transfer', action: 'airport' },
          { label: 'Call 24/7 Dispatch', action: 'call' }
        ];
      } else if (/\b(corporate|company|employee|business|office)\b/.test(normalizedText)) {
        reply = 'Orange Cars supports corporate and employee transportation. Share your company name and travel requirements, or contact our key accounts team for a proposal.';
        quickReplies = [
          { label: 'Corporate Inquiry', action: 'corporate' },
          { label: 'Call 24/7 Dispatch', action: 'call' }
        ];
      } else if (/\b(vehicle|fleet|car|cars|suv|sedan|traveller|innova)\b/.test(normalizedText)) {
        reply = 'Our fleet includes sedans, SUVs, premium MPVs, and traveller vehicles. Open Our Fleet to compare available categories, passenger capacity, and current starting rates.';
        quickReplies = [
          { label: 'Book a Ride', action: 'book' },
          { label: 'Call 24/7 Dispatch', action: 'call' }
        ];
      } else if (/\b(book|booking|ride|reserve|trip)\b/.test(normalizedText)) {
        reply = 'I can help you arrange a ride. Start a booking and enter your route, travel date, passenger details, and preferred vehicle to receive a confirmed quote.';
      } else if (/\b(hello|hi|hey|good morning|good evening)\b/.test(normalizedText)) {
        reply = 'Hello! I’m here to help with bookings, airport transfers, fleet options, and corporate travel. What would you like to know?';
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          quickReplies,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* LEFT SIDE: 24/7 AI Concierge Chatbot Trigger & Modal     */}
      {/* ======================================================== */}
      <div className="floating-widget-chat fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 pointer-events-auto">
        {/* 24/7 AI Concierge Bot Trigger */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="floating-widget-chat-trigger h-14 w-14 rounded-full bg-[#101010] p-3.5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95 border border-white/20 flex items-center justify-center relative group"
          aria-label="24/7 Travel Concierge"
          title="24/7 Travel Concierge Chatbot"
        >
          {isChatOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-6 h-6 text-accentOrange group-hover:rotate-12 transition-transform duration-300" />
          )}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brandRed rounded-full border-2 border-white animate-pulse" />
          
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-xl bg-[#101010] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-white/10 transition-opacity group-hover:opacity-100 hidden sm:inline-block">
            {isChatOpen ? 'Close Concierge' : 'Chat with Concierge'}
          </span>
        </button>
      </div>

      {/* Concierge Modal Window (Anchored to Left Side) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="floating-widget-chat-panel fixed bottom-24 left-4 sm:left-6 z-50 w-[92vw] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="bg-[#101010] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accentOrange flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">Orange Cars Concierge</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online &bull; 24/7 Automated Dispatch
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white p-1 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Thread */}
            <div ref={messageThreadRef} aria-live="polite" aria-relevant="additions text" className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/70 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brandRed text-white rounded-br-none'
                        : 'bg-white text-charcoal border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.quickReplies.map((qr, qidx) => (
                        <button
                          key={qidx}
                          onClick={() => handleQuickReply(qr.action)}
                          className="px-2.5 py-1 rounded-full bg-white border border-gray-300 text-charcoal text-[11px] font-semibold hover:border-brandRed hover:text-brandRed transition-colors shadow-2xs"
                        >
                          {qr.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                aria-label="Message Orange Cars Concierge"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about cabs, fares, routes..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:border-brandRed outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-brandRed text-white hover:bg-brandRed-hover transition-colors"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* RIGHT SIDE: Scroll To Top, Call Icon & WhatsApp Icon     */}
      {/* ======================================================== */}
      {!isChatOpen && (
      <div className="floating-widget-actions fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Scroll To Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="floating-widget-scroll-top w-11 h-11 rounded-full bg-white text-charcoal border border-gray-200 shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Scroll to top"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4 text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 24/7 Call Icon Button */}
        <a
          href="tel:+919742588995"
          className="floating-widget-call h-14 w-14 rounded-full bg-brandRed text-white shadow-[0_8px_25px_rgba(230,0,0,0.35)] hover:bg-[#c90000] hover:scale-105 active:scale-95 border border-white/20 transition-all flex items-center justify-center relative group"
          title="Call 24/7 Dispatch (+91 97425 88995)"
          aria-label="Call Dispatch"
        >
          <Phone className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Tooltip */}
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl bg-[#101010] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-white/10 transition-opacity group-hover:opacity-100 hidden sm:inline-block">
            Call Dispatch (+91 97425 88995)
          </span>
        </a>

        {/* WhatsApp Direct Button */}
        <a
          href="https://wa.me/919742588995?text=Hello%20Orange%20Cab,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20cab."
          target="_blank"
          rel="noopener noreferrer"
          className="floating-widget-whatsapp flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all group relative"
          title="Instant WhatsApp Support (+91 97425 88995)"
          aria-label="WhatsApp Support"
        >
          <svg className="h-6 w-6 fill-current group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.06.8.82-2.98-.19-.31a8.19 8.19 0 0 1-1.28-4.48c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.01-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.47-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.18-.06-.11-.23-.17-.48-.3" />
          </svg>
        </a>
      </div>
      )}
    </>
  );
}
