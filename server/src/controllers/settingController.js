import Setting from '../models/Setting.js';
import ActivityLog from '../models/ActivityLog.js';

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
    if (req.body.outstationPricing?.minimumBillingDistance !== undefined
      && Number(req.body.outstationPricing.minimumBillingDistance) !== 300) {
      return res.status(400).json({
        success: false,
        message: 'The minimum outstation billing distance is fixed at 300 km.'
      });
    }

    if (Array.isArray(req.body.vehicleCategories)) {
      const names = req.body.vehicleCategories.map(({ name }) => name?.trim().toLowerCase());
      const hasInvalidRate = req.body.vehicleCategories.some(({ minRate, maxRate }) => (
        !Number.isFinite(Number(minRate))
        || !Number.isFinite(Number(maxRate))
        || Number(minRate) <= 0
        || Number(maxRate) < Number(minRate)
      ));

      if (hasInvalidRate || names.some((name) => !name) || new Set(names).size !== names.length) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle categories must have unique names and valid per-kilometre rates.'
        });
      }
    }

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    await ActivityLog.create({
      action: 'Website Settings Updated',
      details: 'Updated global rates, contact info and theme settings',
      adminName: req.admin?.name || 'Admin',
      category: 'system'
    });

    res.json({ success: true, message: 'Settings saved successfully', settings });
  } catch (error) {
    next(error);
  }
};
