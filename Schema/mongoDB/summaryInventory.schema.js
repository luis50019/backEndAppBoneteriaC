import mongoose from 'mongoose';

const summaryInventorySchema = new mongoose.Schema({
  totalInventory: { type: Number, required: true,default:0 },//numero de piezas en total en el inventario
  totalInventoryValue: { type: Number, required: true,default:0 }, // valor total del inventario
  totalProfit: { type: Number, required: true,default:0 }, // total de ganancias
  totalSales:{type: Number, required: true,default:0}, // total de las ventas
  lastFecha: { type: Date, default: Date.now }
});

export default mongoose.model('SummaryInventory', summaryInventorySchema);

