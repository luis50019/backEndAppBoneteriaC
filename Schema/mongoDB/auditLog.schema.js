import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  action: { type: String, enum: ['INSERT', 'UPDATE', 'DELETE'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  oldData: mongoose.Schema.Types.Mixed,
  newData: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);

