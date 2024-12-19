import mongoose from 'mongoose';

const typeMaterialSchema = new mongoose.Schema({
  material: { type: String, required: true, unique: true }
});

export default mongoose.model('TypeMaterial', typeMaterialSchema);

