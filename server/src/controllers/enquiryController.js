import Enquiry from '../models/Enquiry.js';
import ActivityLog from '../models/ActivityLog.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, source } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone and message' });
    }

    const enquiry = await Enquiry.create({
      name,
      email: email || `${phone}@guest.orangecab.in`,
      phone,
      subject: subject || 'General Enquiry',
      message,
      source: source || 'contact_form'
    });

    await ActivityLog.create({
      action: 'New Lead/Enquiry',
      details: `Enquiry from ${name} (${phone}) - ${subject || 'General'}`,
      category: 'system'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Our travel manager will contact you promptly.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, source } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (source && source !== 'all') query.source = source;

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, replyMessage, isRead } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;
    if (replyMessage) {
      updateData.replyMessage = replyMessage;
      updateData.status = 'Replied';
      updateData.repliedAt = new Date();
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, enquiry });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    next(error);
  }
};
