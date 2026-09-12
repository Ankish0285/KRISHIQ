import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    farmName: {
      type: String,
      trim: true,
    },
    farmSize: {
      type: String,
      trim: true,
    },
    crops: {
      type: [String],
      default: [],
    },
    farmingType: {
      type: String,
      trim: true,
    },
    certifications: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bankInfo: {
      type: Object,
      default: {},
    },
    fpo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FPO',
      default: null,
    },
  },
  { timestamps: true }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
export default Farmer;