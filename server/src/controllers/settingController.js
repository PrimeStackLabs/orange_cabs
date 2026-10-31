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
