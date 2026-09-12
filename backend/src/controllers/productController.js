import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { successResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const getOwnerFilter = (req) => {
  if (req.user.role === 'admin') return {};

  if (req.user.role === 'farmer') return { farmer: req.user._id };
  if (req.user.role === 'fpo') return { fpo: req.user._id };

  return { _id: null };
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, subcategory, price, unit, quantity, minimumOrderQuantity, location, organic, harvestDate, expiryDate } = req.body;

    if (!name || !description || !category || !price || !unit || !quantity) {
      return res.status(400).json({ success: false, message: 'Name, description, category, price, unit and quantity are required.' });
    }

    let imageUrls = Array.isArray(req.body.images) ? req.body.images : [];

    if (req.files && req.files.length) {
      imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'krishiq/products');
        imageUrls.push(url);
      }
    }

    const productPayload = {
      name,
      description,
      category,
      subcategory,
      images: imageUrls,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      minimumOrderQuantity: Number(minimumOrderQuantity || 1),
      location,
      organic: Boolean(organic),
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    };

    if (req.user.role === 'farmer') {
      productPayload.farmer = req.user._id;
    }

    if (req.user.role === 'fpo') {
      productPayload.fpo = req.user._id;
    }

    const product = await Product.create(productPayload);

    await Notification.create({
      recipient: req.user._id,
      title: 'Product listed',
      message: `${name} has been listed successfully.`,
      type: 'product_update',
    });

    return res.status(201).json(successResponse(product, 'Product created successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, location, organic, status } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (status) filters.status = status;
    if (location) filters.location = { $regex: location, $options: 'i' };
    if (organic !== undefined) filters.organic = organic === 'true';

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.user && req.user.role !== 'admin' && req.user.role !== 'buyer') {
      Object.assign(filters, getOwnerFilter(req));
    }

    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .populate('farmer', 'farmName user')
      .populate('fpo', 'organizationName user');

    return res.status(200).json(successResponse(products, 'Products fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'farmName user')
      .populate('fpo', 'organizationName user');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json(successResponse(product, 'Product fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (req.user.role !== 'admin') {
      const isOwner =
        (product.farmer && product.farmer.toString() === req.user._id.toString()) ||
        (product.fpo && product.fpo.toString() === req.user._id.toString());

      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You can only update your own products.' });
      }
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    if (req.body.quantity !== undefined) {
      product.availableQuantity = Number(req.body.quantity);
    }

    await product.save();

    return res.status(200).json(successResponse(product, 'Product updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (req.user.role !== 'admin') {
      const isOwner =
        (product.farmer && product.farmer.toString() === req.user._id.toString()) ||
        (product.fpo && product.fpo.toString() === req.user._id.toString());

      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You can only delete your own products.' });
      }
    }

    await product.deleteOne();

    return res.status(200).json(successResponse(null, 'Product deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  req.query.search = req.query.q || req.query.search;
  return getProducts(req, res, next);
};

export const getProductsByCategory = async (req, res, next) => {
  req.query.category = req.params.category;
  return getProducts(req, res, next);
};

export const getProductsByFarmer = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.params.farmerId }).sort({ createdAt: -1 });
    return res.status(200).json(successResponse(products, 'Farmer products fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getProductsByFarmer,
};