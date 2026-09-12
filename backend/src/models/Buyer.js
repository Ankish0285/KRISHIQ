import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    preferredCategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Buyer = mongoose.model('Buyer', buyerSchema);
export default Buyer;