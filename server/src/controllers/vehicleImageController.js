import { v2 as cloudinary } from 'cloudinary';
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

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Image storage is not configured. Contact the system administrator.'
      });
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true
    });

    const image = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: 'orange-cabs/vehicles',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
      stream.end(req.file.buffer);
    });

    if (!image?.secure_url) {
      throw new Error('Image storage did not return a secure image URL.');
    }

    res.status(201).json({ success: true, imageUrl: image.secure_url });
  } catch (error) {
    next(error);
  }
};
