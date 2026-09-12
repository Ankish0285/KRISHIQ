import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      default: null,
    },
    fpo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FPO',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      default: 'kg',
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    location: {
      type: String,
      trim: true,
    },
    organic: {
      type: Boolean,
      default: false,
    },
    harvestDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, category: 1 });
productSchema.index({ location: 1 });
productSchema.index({ status: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;