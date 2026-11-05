import multer from 'multer';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter(req, file, callback) {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new Error('Choose a JPG, JPEG, PNG, or WEBP image.'));
      return;
    }

    callback(null, true);
  }
});

export const receiveVehicleImage = (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
      ? 'Image must be 5 MB or smaller.'
      : error.message || 'Image upload failed.';
    res.status(400).json({ success: false, message });
  });
};

export const validateVehicleImageContents = (file) => {
  const { buffer, mimetype, originalname } = file;
  const extension = originalname.split('.').pop()?.toLowerCase();
  const typeMatchesExtension = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp']
  };
  if (!typeMatchesExtension[mimetype]?.includes(extension)) return false;

  if (mimetype === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === 'image/png') {
    return buffer.length >= 8
      && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  return buffer.length >= 12
    && buffer.toString('ascii', 0, 4) === 'RIFF'
    && buffer.toString('ascii', 8, 12) === 'WEBP';
};
