import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                public_id: `resumes/${Date.now()}_${fileName}`,
                format: 'pdf',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export const uploadImageToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const sanitizedFileName = fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                public_id: `avatars/${Date.now()}_${sanitizedFileName}`,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    });
};
