import { Router } from 'express';
import SiteSetting from '../models/SiteSetting.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/site-settings', async (req, res, next) => {
  try {
    const settings = await SiteSetting.find({
      key: { $not: /^draft:/, $nin: ['_draft', '_publishedAt'] },
    })
      .select('key value -_id')
      .lean();
    return res.json(
      successResponse(
        Object.fromEntries(settings.map(({ key, value }) => [key, value])),
        'Published site settings fetched.'
      )
    );
  } catch (error) {
    next(error);
  }
});

export default router;
