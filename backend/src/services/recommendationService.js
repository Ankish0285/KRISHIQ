import Product from '../models/Product.js';

export const getRecommendations = async ({ category, location, limit = 5 }) => {
  const filters = { status: 'active' };

  if (category) filters.category = category;
  if (location) filters.location = new RegExp(location, 'i');

  return Product.find(filters).limit(limit).sort({ rating: -1, reviewCount: -1 });
};

export default { getRecommendations };