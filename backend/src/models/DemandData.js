import mongoose from 'mongoose';

const demandDataSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    category: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    demandScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    source: {
      type: String,
      default: 'manual',
    },
  },
  { timestamps: true }
);

const DemandData = mongoose.model('DemandData', demandDataSchema);
export default DemandData;