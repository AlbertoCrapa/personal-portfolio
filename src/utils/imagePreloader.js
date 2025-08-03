/**
 * Image preloader utility for performance optimization
 */

const imageCache = new Map();

/**
 * Preload a single image
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
 */
export const preloadImage = (src) => {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    
    img.onerror = (error) => {
      console.warn(`Failed to preload image: ${src}`, error);
      reject(error);
    };
    
    img.src = src;
  });
};

/**
 * Preload multiple images
 * @param {string[]} sources - Array of image source URLs
 * @returns {Promise<HTMLImageElement[]>}
 */
export const preloadImages = (sources) => {
  return Promise.allSettled(sources.map(preloadImage))
    .then(results => {
      const loaded = [];
      const failed = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.push(result.value);
        } else {
          failed.push(sources[index]);
        }
      });
      
      if (failed.length > 0) {
        console.warn('Some images failed to preload:', failed);
      }
      
      return loaded;
    });
};

/**
 * Check if image is already cached
 * @param {string} src - Image source URL
 * @returns {boolean}
 */
export const isImageCached = (src) => {
  return imageCache.has(src);
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  imageCache.clear();
};
