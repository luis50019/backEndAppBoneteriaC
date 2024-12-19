import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  saleDate: { type: Date, default: Date.now },
  typeSale: { type: String, enum: ['Oficial', 'No oficial'], required: true },
  total: { type: Number, required: true },
  details: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    pieceQuantity: { type: Number, default: 0 },
    quantityDozens: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    dozenPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    subTotal: { type: Number, required: true }
  }]
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);

