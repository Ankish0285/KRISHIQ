import { v2 as cloudinary } from 'cloudinary';
import config from './config.js';

const cloudinaryConfig = config.cloudinary;

if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  });
}

export const uploadToCloudinary = async (fileBuffer, folder = 'krishiq') => {
  const result = await uploadResultToCloudinary(fileBuffer, folder);
  return result.secure_url;
};

export const uploadResultToCloudinary = async (fileBuffer, folder = 'krishiq') => {
  const cloudName = String(cloudinaryConfig.cloudName || '').trim();
  const isPlaceholder = !cloudName || ['krishiq', 'your-cloud-name', 'your_cloud_name'].includes(cloudName.toLowerCase());
  if (isPlaceholder || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME to the Cloudinary dashboard cloud name, along with CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      }
    );

    stream.end(fileBuffer);
  });

  return result;
};

export default cloudinary;