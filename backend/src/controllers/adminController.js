import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import SiteSetting from '../models/SiteSetting.js';
import { successResponse } from '../utils/apiResponse.js';
import { recordAudit } from '../services/auditService.js';
import { uploadResultToCloudinary, uploadToCloudinary } from '../config/cloudinary.js';

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  permissions: user.permissions || [],
  isActive: user.isActive,
  isFirstLogin: user.isFirstLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getOverview = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, farmers, buyers, products, orders, revenue, pendingProducts, roleBreakdown, orderStatus, recentActivity] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Product.countDocuments({ status: 'inactive' }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('actor', 'name email role').lean(),
    ]);
    return res.json(successResponse({ totalUsers, activeUsers, farmers, buyers, products, orders, revenue: revenue[0]?.total || 0, pendingProducts, roleBreakdown, orderStatus, recentActivity }, 'Admin overview fetched.'));
  } catch (error) { next(error); }
};

export const listUsers = async (req, res, next) => {
  try {
    const { search = '', role, active, page = 1, limit = 25 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (active !== undefined) filter.isActive = active === 'true';
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (Number(page) - 1) * Math.min(Number(limit), 100);
    const size = Math.min(Number(limit), 100);
    const [users, total] = await Promise.all([User.find(filter).select('-password -loginOtpHash -loginOtpExpiresAt -loginOtpAttempts -loginOtpLastSentAt').sort({ createdAt: -1 }).skip(skip).limit(size), User.countDocuments(filter)]);
    return res.json(successResponse({ users: users.map(publicUser), total, page: Number(page), limit: size }, 'Users fetched.'));
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { isActive, role, permissions } = req.body;
    if (user._id.toString() === req.user._id.toString() && (isActive === false || role && role !== req.user.role)) return res.status(400).json({ success: false, message: 'You cannot deactivate or demote yourself.' });
    if (role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ success: false, message: 'Only super admin can create super admins.' });
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') return res.status(403).json({ success: false, message: 'Only super admin can manage super admins.' });
    if (role && !['buyer', 'farmer', 'fpo', 'logistics', 'admin', 'super_admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role.' });
    if (isActive !== undefined) user.isActive = Boolean(isActive);
    if (role) user.role = role;
    if (Array.isArray(permissions) && req.user.role === 'super_admin') user.permissions = permissions.filter((permission) => typeof permission === 'string').slice(0, 50);
    await user.save();
    await recordAudit({ req, action: 'user_updated', resourceType: 'User', resourceId: user._id, metadata: { role: user.role, isActive: user.isActive } });
    return res.json(successResponse(publicUser(user), 'User updated.'));
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'super_admin' || user._id.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'This user cannot be deleted.' });
    await user.deleteOne();
    await recordAudit({ req, action: 'user_deleted', resourceType: 'User', resourceId: user._id, metadata: { role: user.role } });
    return res.json(successResponse(null, 'User deleted.'));
  } catch (error) { next(error); }
};

export const listProducts = async (req, res, next) => {
  try {
    const { search = '', status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(200).populate('farmer', 'farmName user').populate('fpo', 'organizationName user');
    return res.json(successResponse(products, 'Products fetched.'));
  } catch (error) { next(error); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const allowed = ['name', 'description', 'category', 'price', 'quantity', 'availableQuantity', 'status', 'organic'];
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    allowed.forEach((key) => { if (req.body[key] !== undefined) product[key] = req.body[key]; });
    await product.save();
    await recordAudit({ req, action: 'product_updated', resourceType: 'Product', resourceId: product._id, metadata: { status: product.status } });
    return res.json(successResponse(product, 'Product updated.'));
  } catch (error) { next(error); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await product.deleteOne();
    await recordAudit({ req, action: 'product_deleted', resourceType: 'Product', resourceId: product._id, metadata: { name: product.name } });
    return res.json(successResponse(null, 'Product deleted.'));
  } catch (error) { next(error); }
};

export const listOrders = async (req, res, next) => {
  try {
    const filter = req.query.status ? { orderStatus: req.query.status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).populate('buyer', 'name email phone role').populate('items.product', 'name category price');
    return res.json(successResponse(orders, 'Orders fetched.'));
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const allowed = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid order status.' });
    order.orderStatus = req.body.status;
    await order.save();
    await recordAudit({ req, action: 'order_status_changed', resourceType: 'Order', resourceId: order._id, metadata: { status: order.orderStatus } });
    return res.json(successResponse(order, 'Order status updated.'));
  } catch (error) { next(error); }
};

export const listAuditLogs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.action) filter.action = req.query.action;
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200).populate('actor', 'name email role');
    return res.json(successResponse(logs, 'Audit logs fetched.'));
  } catch (error) { next(error); }
};

export const getSettings = async (req, res, next) => {
  try {
    const records = await SiteSetting.find({ key: { $not: /^draft:/ } }).sort({ key: 1 }).select('key value updatedAt').lean();
    const drafts = await SiteSetting.find({ key: /^draft:/ }).select('key value').lean();
    const merged = new Map(records.map((item) => [item.key, item]));
    drafts.forEach((item) => merged.set(item.key.replace(/^draft:/, ''), { ...item, key: item.key.replace(/^draft:/, ''), draft: true }));
    return res.json(successResponse([...merged.values()], 'Settings fetched.'));
  } catch (error) { next(error); }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body && typeof req.body === 'object' ? req.body : {};
    const publish = updates._publish === true;
    const blocked = /secret|password|token|credential|api.?key|database|email.?pass/i;
    const entries = Object.entries(updates).filter(([key, value]) => {
      if (key === '_publish' || blocked.test(key) || value === undefined || value === null) return false;
      if (['string', 'number', 'boolean'].includes(typeof value)) return true;
      if (Array.isArray(value)) return value.length <= 100;
      return typeof value === 'object' && Object.keys(value).length <= 100;
    });
    const settings = [];
    for (const [key, value] of entries.slice(0, 80)) {
      const targetKey = publish ? key : `draft:${key}`;
      settings.push(await SiteSetting.findOneAndUpdate({ key: targetKey }, { key: targetKey, value, updatedBy: req.user._id }, { upsert: true, new: true }));
      if (publish) await SiteSetting.deleteOne({ key: `draft:${key}` });
    }
    await recordAudit({ req, action: publish ? 'website_published' : 'website_draft_saved', resourceType: 'SiteSetting', metadata: { keys: entries.map(([key]) => key), published: publish } });
    return res.json(successResponse(settings, publish ? 'Website changes published.' : 'Website draft saved.'));
  } catch (error) { next(error); }
};

export const uploadAdminMedia = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please select an image or video file.' });
    const result = await uploadResultToCloudinary(req.file.buffer, 'krishiq/site-media');
    await recordAudit({ req, action: 'website_media_uploaded', resourceType: 'SiteSetting', metadata: { originalName: req.file.originalname, mimeType: req.file.mimetype } });
    return res.json(successResponse({ url: result.secure_url, publicId: result.public_id, mimeType: req.file.mimetype, type: req.file.resource_type === 'video' ? 'video' : 'image', duration: result.duration || null }, 'Website media uploaded.'));
  } catch (error) { next(error); }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email: rawEmail, password, permissions = [] } = req.body;
    const email = String(rawEmail || '').trim().toLowerCase();
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Name, valid email and a password of at least 6 characters are required.' });
    }
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: 'An account already exists with this email.' });
    const user = await User.create({ name: name.trim(), email, password, role: 'admin', permissions: Array.isArray(permissions) ? permissions.slice(0, 50) : [] });
    await recordAudit({ req, action: 'admin_created', resourceType: 'User', resourceId: user._id, metadata: { role: user.role } });
    return res.status(201).json(successResponse(publicUser(user), 'Admin created.'));
  } catch (error) { next(error); }
};

export default { getOverview, listUsers, updateUser, deleteUser, listProducts, updateProduct, deleteProduct, listOrders, updateOrderStatus, listAuditLogs, getSettings, updateSettings, uploadAdminMedia, createAdmin };
