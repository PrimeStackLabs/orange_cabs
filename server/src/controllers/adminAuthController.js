import Admin from '../models/Admin.js';
import ActivityLog from '../models/ActivityLog.js';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt.js';

const generateAdminToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, getJwtSecret(), {
    expiresIn: '7d'
  });
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Admin account has been disabled' });
    }

    admin.lastLogin = new Date();
    admin.loginLogs.push({
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      device: req.headers['user-agent'] || 'Browser'
    });
    await admin.save();

    await ActivityLog.create({
      action: 'Admin Logged In',
      details: `${admin.name} (${admin.role}) signed into admin console`,
      adminName: admin.name,
      ip: req.ip,
      category: 'auth'
    });

    const token = generateAdminToken(admin._id);
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        avatar: admin.avatar,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminMe = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body || {};
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }

    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Manager',
      phone: phone || '+91 99999 99999'
    });

    await ActivityLog.create({
      action: 'Admin Created',
      details: `Created new admin ${name} with role ${role}`,
      adminName: req.admin?.name || 'Super Admin',
      category: 'system'
    });

    res.status(201).json({
      success: true,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body || {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }
    if (password !== undefined && password !== '' && (typeof password !== 'string' || password.length < 6)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const updatedRole = role || admin.role;
    if (admin._id.equals(req.admin._id) && updatedRole !== admin.role) {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin role' });
    }
    if (admin.role === 'Super Admin' && updatedRole !== 'Super Admin') {
      const anotherActiveSuperAdmin = await Admin.exists({
        _id: { $ne: admin._id },
        role: 'Super Admin',
        isActive: true
      });
      if (!anotherActiveSuperAdmin) {
        return res.status(400).json({ success: false, message: 'At least one active Super Admin must remain' });
      }
    }

    admin.name = name.trim();
    admin.email = email.trim().toLowerCase();
    admin.role = updatedRole;
    admin.phone = typeof phone === 'string' ? phone.trim() : admin.phone;
    if (password) admin.password = password;
    await admin.save();

    await ActivityLog.create({
      action: 'Admin Updated',
      details: `Updated admin ${admin.name} (${admin.email})`,
      adminName: req.admin.name,
      category: 'system'
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }
    if (admin._id.equals(req.admin._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }
    if (admin.role === 'Super Admin' && admin.isActive) {
      const anotherActiveSuperAdmin = await Admin.exists({
        _id: { $ne: admin._id },
        role: 'Super Admin',
        isActive: true
      });
      if (!anotherActiveSuperAdmin) {
        return res.status(400).json({ success: false, message: 'At least one active Super Admin must remain' });
      }
    }

    await ActivityLog.create({
      action: 'Admin Deleted',
      details: `Deleted admin ${admin.name} (${admin.email})`,
      adminName: req.admin.name,
      category: 'system'
    });
    await admin.deleteOne();

    res.json({ success: true, message: 'Admin account deleted' });
  } catch (error) {
    next(error);
  }
};
