import mongoose from 'mongoose';

const desiredAgeSchema = new mongoose.Schema({
  desiredAge: { type: String, required: true },
  minimumAge: { type: Number, default: 0 },
  maximumAge: { type: Number, default: 0 }
});

export default mongoose.model('DesiredAge', desiredAgeSchema);

