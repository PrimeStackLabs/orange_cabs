import Route from '../models/Route.js';

export const getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find().sort({ popular: -1, createdAt: -1 });
    res.json({ success: true, count: routes.length, routes });
  } catch (error) {
    next(error);
  }
};

export const createRoute = async (req, res, next) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, route });
  } catch (error) {
    next(error);
  }
};

export const updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, route });
  } catch (error) {
    next(error);
  }
};

export const deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, message: 'Route removed' });
  } catch (error) {
    next(error);
  }
};
