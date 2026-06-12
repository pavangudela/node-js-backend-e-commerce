import stream from 'stream';
import cloudinary from '../utils/cloudinary.js';
import AppError from '../utils/AppError.js';

const uploadImage = (file, folder) => new Promise((resolve, reject) => {
  if (!file) return reject(new AppError('Image file is required', 400));
  const upload = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
    if (error) return reject(error);
    return resolve({ imageUrl: result.secure_url, publicId: result.public_id });
  });
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  bufferStream.pipe(upload);
});

export default { uploadImage };
