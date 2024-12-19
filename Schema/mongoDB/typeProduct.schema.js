import mongoose from 'mongoose';

const typeProductSchema = new mongoose.Schema({
  typeProduct: { type: String, required: true, unique: true }
});

export default mongoose.model('TypeProduct', typeProductSchema);

