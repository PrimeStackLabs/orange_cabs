import mongoose from 'mongoose';
import VehicleImage from '../models/VehicleImage.js';
import { validateVehicleImageContents } from '../middleware/vehicleImageUpload.js';

export const uploadVehicleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Select an image to upload.' });
    }

    if (!validateVehicleImageContents(req.file)) {
      return res.status(400).json({
        success: false,
        message: 'The selected file is not a valid JPG, JPEG, PNG, or WEBP image.'
      });
    }

    const storedImage = await VehicleImage.create({
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    const imageUrl = new URL(`/api/cabs/images/${storedImage._id}`, `${req.protocol}://${req.get('host')}`).toString();
    return res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    next(error);
  }
};

export const getVehicleImage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).end();
    }

    const image = await VehicleImage.findById(req.params.id).select('data contentType');
    if (!image) return res.status(404).end();

    res.set({
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff'
    });
    return res.send(image.data);
  } catch (error) {
    return next(error);
  }
};
