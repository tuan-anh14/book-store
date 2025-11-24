import dayjs from "dayjs";

export const FORMATE_DATE = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD/MM/YYYY";
export const MAX_UPLOAD_IMAGE_SIZE = 2; //2mb

export const dateRangeValidate = (dateRange: any) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE).toDate();

  return [startDate, endDate];
};

/**
 * Check if a string is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Get image URL - handles both Cloudinary URLs and local paths
 * @param imagePath - Can be a Cloudinary URL or a local filename
 * @param folderType - Folder type for local paths (e.g., 'book', 'avatar', 'comment')
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string | undefined, folderType: string = 'book'): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL (Cloudinary), return as is
  if (isCloudinaryUrl(imagePath)) {
    return imagePath;
  }
  
  // Otherwise, construct local URL (for backward compatibility with old data)
  return `${import.meta.env.VITE_BACKEND_URL}/images/${folderType}/${imagePath}`;
};