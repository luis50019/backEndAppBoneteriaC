import mongoose from 'mongoose';

const sizeClothingSchema = new mongoose.Schema({
  size: { type: String, required: true, unique: true }
});

export default mongoose.model('SizeClothing', sizeClothingSchema);

