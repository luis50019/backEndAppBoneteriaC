import mongoose from 'mongoose';

const summaryInventorySchema = new mongoose.Schema({
  totalInventory: { type: Number, required: true },
  totalInventoryValue: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  lastFecha: { type: Date, default: Date.now }
});

export default mongoose.model('SummaryInventory', summaryInventorySchema);

