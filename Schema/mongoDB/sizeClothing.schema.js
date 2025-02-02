import mongoose from 'mongoose';

const sizeClothingSchema = new mongoose.Schema({
  size: { type: String, required: true },
  type_product: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
},{strict: false});

export default mongoose.model('sizeclothings', sizeClothingSchema);