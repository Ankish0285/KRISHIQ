import { getRecommendations } from '../services/recommendationService.js';
import { getPriceTrend, getCurrentProductPrice, getHistoricalPrice, getSuggestedPrice } from '../services/priceService.js';
import DemandData from '../models/DemandData.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAiRecommendations = async (req, res, next) => {
  try {
    const recommendations = await getRecommendations({
      category: req.query.category,
      location: req.query.location,
      limit: Number(req.query.limit || 5),
    });

    return res.status(200).json(successResponse(recommendations, 'AI recommendations fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getPriceInsights = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const currentPrice = await getCurrentProductPrice(productId);
    const historicalPrices = await getHistoricalPrice(productId);
    const suggestedPrice = await getSuggestedPrice(productId);
    const trend = await getPriceTrend(productId);

    return res.status(200).json(
      successResponse(
        {
          currentPrice,
          historicalPrices,
          suggestedPrice,
          trend,
        },
        'Price insights fetched successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getDemandForecast = async (req, res, next) => {
  try {
    const demand = await DemandData.find({}).sort({ date: -1 }).limit(20);
    return res.status(200).json(successResponse(demand, 'Demand forecast fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  getAiRecommendations,
  getPriceInsights,
  getDemandForecast,
};