import Review from '../models/Review.js';

export const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { authorName, authorCity, rating, comment, routeOrService } = req.body;
    if (!authorName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and feedback comment' });
    }

    const review = await Review.create({
      authorName,
      authorCity: authorCity || 'Verified Passenger',
      rating: Number(rating),
      comment,
      routeOrService: routeOrService || 'Outstation Trip',
      status: 'approved' // Auto-approve for demo
    });

    res.status(201).json({ success: true, message: 'Thank you for your review!', review });
  } catch (error) {
    next(error);
  }
};

export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { status, featured } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, featured },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
