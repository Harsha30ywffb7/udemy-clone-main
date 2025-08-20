// Cloudinary Configuration
// Update these values with your Cloudinary account details

export const CLOUDINARY_CONFIG = {
  // Your Cloudinary cloud name (found in your dashboard)
  CLOUD_NAME: "YOUR_CLOUD_NAME",

  // Upload preset name (create this in your Cloudinary dashboard)
  // Go to Settings > Upload > Add upload preset
  // Set it to "Unsigned" for frontend uploads
  UPLOAD_PRESET: "YOUR_UPLOAD_PRESET",

  // API URLs
  UPLOAD_URL: "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
  BASE_URL: "https://res.cloudinary.com/YOUR_CLOUD_NAME",

  // Upload settings
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ["jpg", "jpeg", "png", "webp"],

  // Folders for organization
  FOLDERS: {
    COURSE_THUMBNAILS: "course-thumbnails",
    PROFILE_IMAGES: "profile-images",
    COURSE_MATERIALS: "course-materials",
  },

  // Default transformations
  TRANSFORMATIONS: {
    THUMBNAIL: {
      width: 800,
      height: 450,
      crop: "fill",
      quality: "auto",
      format: "auto",
    },
    PROFILE: {
      width: 200,
      height: 200,
      crop: "fill",
      quality: "auto",
      format: "auto",
    },
  },
};

// Instructions for setup:
/*
1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Go to your Dashboard and find your Cloud Name
3. Go to Settings > Upload > Add upload preset
4. Create an unsigned upload preset (for frontend uploads)
5. Update the values above with your actual Cloudinary details
6. Replace 'YOUR_CLOUD_NAME' with your actual cloud name
7. Replace 'YOUR_UPLOAD_PRESET' with your actual upload preset name
*/
