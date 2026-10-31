/**
 * ORANGE CABS — INTELLIGENT AI MOBILITY CONCIERGE
 * Holographic AI Assistant & Instant WhatsApp Dispatch
 * Developed by primepro.ai
 */

document.addEventListener('DOMContentLoaded', () => {
  initAIChatbot();
});

function initAIChatbot() {
  const toggleBtn = document.getElementById('ai-chatbot-toggle');
  const chatWindow = document.getElementById('ai-chatbot-window');
  const closeBtn = document.getElementById('ai-chatbot-close');
  const inputEl = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messagesBody = document.getElementById('chatbot-messages');

  if (!toggleBtn || !chatWindow || !inputEl || !messagesBody) return;

  // Toggle chat
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Knowledge base for instant intelligent replies
  const knowledgeBase = [
    {
      keywords: ['ev', 'electric', 'green', 'sustainable', 'emission', 'carbon'],
      response: "🌿 **Orange Cabs Zero-Emission Fleet**: We offer modern Electric Sedans (EVs) for eco-conscious enterprises in Bengaluru. Features include zero tailpipe emissions, silent executive rides, GPS telematics, and up to 450kg monthly CO₂ reduction per vehicle! Would you like a fleet leasing proposal?",
      chips: ['EV Pricing', 'Book EV Sedan', 'Talk to Sales']
    },
    {
      keywords: ['fleet', 'vehicle', 'car', 'sedan', 'suv', 'tempo', 'bus', 'coach', 'innova'],
      response: "🚗 **Our 500+ Vehicle Fleet Includes:**\n• **Electric (EV) Sedans**: 4-Seater\n• **Executive Sedans**: Dzire, Etios, Amaze\n• **Luxury SUVs & MUVs**: Innova Crysta, Ertiga (7-Seater)\n• **Tempo Travellers**: 12–17 Seater push-back AC\n• **Luxury Coaches**: 35–45 Seater Volvo/Scania\n• **Staff Buses**: 50+ Seater with CCTV\nWhich vehicle category best suits your team?",
      chips: ['Executive Sedan', 'Innova Crysta', 'Tempo Traveller', 'Staff Bus']
    },
    {
      keywords: ['safety', 'posh', 'driver', 'police', 'night', 'women', 'security', 'cctv', 'sos'],
      response: "🛡️ **Zero-Compromise Safety Protocols:**\n• 100% Police-verified & medically certified chauffeurs\n• POSH-certified staff & gender-sensitive training\n• Mandatory security escort guards for late-night female staff\n• Real-time GPS telematics & physical SOS alarm buttons\n• 24/7 Incident Command Center (<3 min emergency response)",
      chips: ['Safety Credentials', 'Request Night Cab', 'WhatsApp Dispatch']
    },
    {
      keywords: ['quote', 'price', 'pricing', 'cost', 'rate', 'fare', 'billing', 'charge', 'invoice'],
      response: "💼 **Corporate Pricing & Billing:**\nWe provide flexible models including **Dedicated Fleet Leasing**, **Monthly Fixed Contracts**, and **Per-Km Shared Routes** with single consolidated GST invoices! Use our interactive Fare Estimator or click below to receive an official corporate proposal.",
      chips: ['Calculate Fare', 'Instant WhatsApp Proposal', 'Call Sales']
    },
    {
      keywords: ['area', 'location', 'bengaluru', 'bangalore', 'whitefield', 'electronic city', 'manyata', 'route'],
      response: "📍 **Coverage Across Bengaluru & Karnataka:**\nWe operate across all major IT corridors including Whitefield, Electronic City, Outer Ring Road (ORR), Bellandur, Sarjapur, Manyata Tech Park, Bagmane, Hosakote, and Kempegowda International Airport (BLR).",
      chips: ['Airport Transfers', 'Employee Commute', 'Get Quote']
    },
    {
      keywords: ['iso', 'compliance', 'msme', 'rto', 'certificate', 'gst'],
      response: "🏅 **Statutory Credentials & Certifications:**\n• **ISO 9001:2015** Quality Management System Certified\n• **MSME Registered** (Govt. of India)\n• **100% RTO & GST Compliant** with valid input tax credit\n• Comprehensive commercial passenger insurance coverage on all 500+ vehicles.",
      chips: ['View ISO Specs', 'Book Corporate Fleet', 'Talk to Director']
    },
    {
      keywords: ['hello', 'hi', 'hey', 'start', 'help'],
      response: "Hello! Welcome to **Orange Cabs Premier Corporate Mobility**. How may I assist your enterprise today? You can ask about our 500+ vehicle fleet, corporate commute contracts, EV mobility, or get an instant quote.",
      chips: ['View Fleet', 'Corporate Quote', 'Safety & POSH', 'WhatsApp Call']
    }
  ];

  function getBotResponse(userMsg) {
    const text = userMsg.toLowerCase();

    for (const item of knowledgeBase) {
      if (item.keywords.some(k => text.includes(k))) {
        return { text: item.response, chips: item.chips };
      }
    }

    return {
      text: "Thank you for reaching out! For tailored corporate contracts, SLA customization, or instant fleet deployment, our operations team is ready to connect with you directly on WhatsApp or phone.",
      chips: ['WhatsApp Support', 'Call +91 97425 88995', 'Calculate Fare']
    };
  }

  function appendMessage(sender, text, chips = []) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    // Format markdown bold & linebreaks
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = formatted;

    if (chips && chips.length > 0) {
      const chipContainer = document.createElement('div');
      chipContainer.className = 'chat-quick-chips';

      chips.forEach(chipText => {
        const chip = document.createElement('span');
        chip.className = 'quick-chip';
        chip.textContent = chipText;
        chip.addEventListener('click', () => {
          handleChipAction(chipText);
        });
        chipContainer.appendChild(chip);
      });

      bubble.appendChild(chipContainer);
    }

    messagesBody.appendChild(bubble);
    messagesBody.scrollTop = messagesBody.scrollHeight;
  }

  function handleChipAction(actionText) {
    if (actionText === 'Instant WhatsApp Proposal' || actionText === 'WhatsApp Support' || actionText === 'WhatsApp Dispatch') {
      window.open('https://wa.me/919742588995?text=Hello%20Orange%20Cabs!%20I%20would%20like%20to%20inquire%20about%20corporate%20mobility%20services.', '_blank');
      return;
    }

    if (actionText.includes('Call')) {
      window.location.href = 'tel:+919742588995';
      return;
    }

    if (actionText === 'Calculate Fare') {
      const calcSection = document.getElementById('calculator');
      if (calcSection) {
        chatWindow.classList.remove('open');
        calcSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (actionText === 'View Fleet') {
      const fleetSection = document.getElementById('fleet');
      if (fleetSection) {
        chatWindow.classList.remove('open');
        fleetSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Default: send as user query
    sendUserMessage(actionText);
  }

  function sendUserMessage(text) {
    appendMessage('user', text);

    // Typing simulation
    setTimeout(() => {
      const { text: botReply, chips } = getBotResponse(text);
      appendMessage('bot', botReply, chips);
    }, 450);
  }

  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendUserMessage(text);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      sendUserMessage(text);
    }
  });

  // Attach chip events to initial greeting
  document.querySelectorAll('.chat-bubble.bot .quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      handleChipAction(chip.textContent);
    });
  });
}
