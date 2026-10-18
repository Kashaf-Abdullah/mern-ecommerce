export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';

export const getNormalizedProductImages = (product, fallbackUrl = FALLBACK_PRODUCT_IMAGE) => {
  const images = [];

  const addImage = (value) => {
    if (!value) return;

    if (typeof value === 'string') {
      const url = value.trim();
      if (url) images.push({ url });
      return;
    }

    const url = typeof value.url === 'string' ? value.url.trim() : '';
    if (url) images.push({ url });
  };

  if (Array.isArray(product?.images)) {
    product.images.forEach(addImage);
  } else if (typeof product?.images === 'string') {
    addImage(product.images);
  }

  if (typeof product?.image === 'string') {
    addImage(product.image);
  }

  if (!images.length) {
    images.push({ url: fallbackUrl });
  }

  return images;
};

export const getProductImageUrl = (product, fallbackUrl = FALLBACK_PRODUCT_IMAGE) => {
  const [image] = getNormalizedProductImages(product, fallbackUrl);
  return image?.url || fallbackUrl;
};
