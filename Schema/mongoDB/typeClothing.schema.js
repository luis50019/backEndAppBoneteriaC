import mongoose from 'mongoose';

const typeClothingSchema = new mongoose.Schema({
  typeclothing: { type: String, required: true, unique: true }
});

export default mongoose.model('TypeClothing', typeClothingSchema);

