import ChatMessage from '../models/ChatMessage.js';
import Setting from '../models/Setting.js';

export const handleChatMessage = async (req, res, next) => {
  try {
    const { sessionId, text, userName, userPhone } = req.body;
    if (!sessionId || !text) {
      return res.status(400).json({ success: false, message: 'sessionId and text are required' });
    }

    // Save user message
    const userMsg = await ChatMessage.create({
      sessionId,
      sender: 'user',
      text,
      userName: userName || 'Guest',
      userPhone: userPhone || ''
    });

    const lower = text.toLowerCase().trim();
    let reply = '';
    let quickReplies = [
      { label: 'Book a Cab', action: 'book' },
      { label: 'Check Fare', action: 'fare' },
      { label: 'Track Booking', action: 'track' },
      { label: 'Talk to Agent', action: 'agent' }
    ];

    if (lower.includes('fare') || lower.includes('price') || lower.includes('cost') || lower.includes('rate')) {
      const settings = await Setting.findOne() || await Setting.create({});
      const categoryRates = (settings.vehicleCategories || []).map(({ name, minRate, maxRate }) => (
        `${name}: ₹${minRate}${maxRate > minRate ? `–₹${maxRate}` : ''}/km`
      ));
      const outstationPricing = settings.outstationPricing;
      reply = categoryRates.length
        ? `Current category rates: ${categoryRates.join('; ')}. Outstation minimum billing distance: ${outstationPricing.minimumBillingDistance} km. ${outstationPricing.tollParkingInfo} ${outstationPricing.driverAllowanceInfo} ${outstationPricing.paymentDueInfo}`
        : 'Current vehicle rates are unavailable. Please contact our team for a confirmed quote.';
      quickReplies = [
        { label: 'Calculate Exact Fare', action: 'fare' },
        { label: 'View Fleet Details', action: 'fleet' }
      ];
    } else if (lower.includes('book') || lower.includes('reserve') || lower.includes('ride')) {
      reply = 'Booking is instant! Head over to our Book A Cab section or select Outstation / Local / Airport tabs right on the homepage to lock in your ride in under 60 seconds.';
      quickReplies = [
        { label: 'Open Booking Form', action: 'book' },
        { label: 'View Popular Routes', action: 'routes' }
      ];
    } else if (lower.includes('track') || lower.includes('status') || lower.includes('driver')) {
      reply = 'You can track your cab and driver live anytime by clicking "Track Booking" in the menu and entering your Booking ID (e.g. OC-2026-00001) and phone number.';
      quickReplies = [
        { label: 'Go to Track Booking', action: 'track' },
        { label: 'Contact Support', action: 'agent' }
      ];
    } else if (lower.includes('fleet') || lower.includes('car') || lower.includes('vehicle') || lower.includes('innova') || lower.includes('sedan')) {
      reply = 'Our premium sanitized fleet includes Swift Dzire / Etios (Sedans), Ertiga / Carens (SUVs), Innova Crysta (Luxury 7-seaters), and Tempo Travellers (12-16 seaters) with 24/7 GPS tracking.';
      quickReplies = [
        { label: 'View All Vehicles', action: 'fleet' },
        { label: 'Book Innova Crysta', action: 'book' }
      ];
    } else if (lower.includes('agent') || lower.includes('human') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('help')) {
      reply = 'Our 24x7 customer support desk is ready to help you directly. You can call +91 99999 99999 or chat with us on WhatsApp!';
      quickReplies = [
        { label: 'Chat on WhatsApp', action: 'whatsapp' },
        { label: 'Call Support (+91 99999 99999)', action: 'call' }
      ];
    } else {
      reply = 'Hello! I am OrangeBot, your 24/7 Orange Cab personal travel assistant. How may I assist your travel plans today?';
    }

    const botMsg = await ChatMessage.create({
      sessionId,
      sender: 'bot',
      text: reply,
      quickReplies
    });

    res.json({
      success: true,
      userMessage: userMsg,
      botResponse: botMsg
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

export const getAllChatSessionsAdmin = async (req, res, next) => {
  try {
    const sessions = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $last: '$text' },
          updatedAt: { $last: '$createdAt' },
          userName: { $last: '$userName' },
          userPhone: { $last: '$userPhone' },
          count: { $sum: 1 }
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);
    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};
