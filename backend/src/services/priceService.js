import Product from '../models/Product.js';

export const getCurrentProductPrice = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  return {
    productId: product._id,
    currentPrice: product.price,
    source: 'mock-provider',
    note: 'Live market API is not configured; this is a placeholder price snapshot.',
  };
};

export const getHistoricalPrice = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return [];

  return [
    {
      date: product.createdAt,
      price: product.price,
      source: 'mock-provider',
    },
  ];
};

export const getSuggestedPrice = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  const suggested = product.price * 1.05;
  return {
    productId: product._id,
    suggestedPrice: Number(suggested.toFixed(2)),
    provider: 'mock-provider',
    note: 'Suggested price is a placeholder until a live market provider is configured.',
  };
};

export const getPriceTrend = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return { trend: 'n/a', direction: 'stable' };

  return {
    productId: product._id,
    trend: 'stable',
    currentPrice: product.price,
    direction: 'stable',
    source: 'mock-provider',
    note: 'Price trend is placeholder data until an external market provider is configured.',
  };
};

export default { getCurrentProductPrice, getHistoricalPrice, getSuggestedPrice, getPriceTrend };