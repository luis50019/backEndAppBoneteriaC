import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true }
});

export default mongoose.model('categories', categorySchema);

