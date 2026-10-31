import Driver from '../models/Driver.js';
import ActivityLog from '../models/ActivityLog.js';

export const getDrivers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const drivers = await Driver.find(query).populate('assignedVehicle').sort({ createdAt: -1 });
    res.json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    await ActivityLog.create({
      action: 'Driver Registered',
      details: `Registered driver ${driver.name} (${driver.phone})`,
      adminName: req.admin?.name || 'Admin',
      category: 'driver'
    });
    res.status(201).json({ success: true, driver });
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, driver });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
