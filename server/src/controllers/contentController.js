import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';
import Gallery from '../models/Gallery.js';
import Setting from '../models/Setting.js';
import ActivityLog from '../models/ActivityLog.js';

// Public all-in-one content loader
export const getPublicContent = async (req, res, next) => {
  try {
    const [faqs, testimonials, gallery, setting] = await Promise.all([
      FAQ.find().sort({ order: 1, createdAt: 1 }),
      Testimonial.find({ status: 'approved' }).sort({ order: 1, createdAt: -1 }),
      Gallery.find().sort({ order: 1, createdAt: 1 }),
      Setting.findOne()
    ]);

    res.json({
      success: true,
      faqs,
      testimonials,
      gallery,
      settings: setting || {}
    });
  } catch (error) {
    next(error);
  }
};

// FAQ CRUD
export const getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    next(error);
  }
};

// Testimonials CRUD
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

// Gallery CRUD
export const getGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.find().sort({ order: 1 });
    res.json({ success: true, count: gallery.length, gallery });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
};

// Settings & Content Sections
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }

    await ActivityLog.create({
      action: 'Settings Updated',
      details: 'Updated website settings or content',
      adminName: req.admin?.name || 'Admin',
      category: 'settings'
    });

    res.json({ success: true, message: 'Settings saved successfully', settings });
  } catch (error) {
    next(error);
  }
};
