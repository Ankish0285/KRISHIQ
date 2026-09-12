import mongoose from 'mongoose';

const fpoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Farmer',
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const FPO = mongoose.model('FPO', fpoSchema);
export default FPO;