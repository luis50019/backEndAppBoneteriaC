import mongoose from 'mongoose';

const stadisticsSalesSchema = new mongoose.Schema({
  lastSale: { type: Date },
  quantitySold: { type: Number, default: 0 },
  incomeTotal: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 }
});

export default mongoose.model('StadisticsSales', stadisticsSalesSchema);
