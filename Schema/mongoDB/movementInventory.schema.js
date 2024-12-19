import mongoose from 'mongoose';

const movementInventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  movementType: { type: String, enum: ['entrada', 'salida'], required: true },
  quantity: { type: Number, required: true },
  dateSale: { type: Date, default: Date.now }
});

export default mongoose.model('MovementInventory', movementInventorySchema);

