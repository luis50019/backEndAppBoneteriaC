import mongoose from 'mongoose';
import { number } from 'zod';

const productSchema = new mongoose.Schema({
  isSecondHand: { type: Boolean, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
  productName: { type: String, required: true },
  purchasePrice: { type: Number, required: true }, // Encrypted
  unitPrice: { type: Number, required: true }, // Encrypted
  dozenPrice: { type: Number, required: true }, // Encrypted
  discount: { type: Number, default: 0 },
  availableUnits: { type: Number, required: true },
  soldUnits: { type: Number, default: 0 },
  incomeGenerated: {type:Number,default:0},
  profitsGenerated: {type:Number,default:0},
  images: [{ type: String }],
  garment: {
    intendedGender: { type: mongoose.Schema.Types.ObjectId, ref: 'genders' },
    size: { type: mongoose.Schema.Types.ObjectId, ref: 'sizeclothings' },
  },
  otherProduct: {
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeMaterial' },
    description: String
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
