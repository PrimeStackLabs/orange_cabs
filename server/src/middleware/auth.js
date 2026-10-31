import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

export const protectUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'orangecab_super_secret_jwt_key_2026_luxury_rides');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.status === 'blocked') {
      return res.status(401).json({ success: false, message: 'User account not active or found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'orangecab_super_secret_jwt_key_2026_luxury_rides');
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin account not authorized' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Admin session expired or invalid' });
  }
};

export const verifyAdminToken = protectAdmin;

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    if (roles.length && !roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: role '${req.admin.role}' does not have sufficient permissions` 
      });
    }
    next();
  };
};
