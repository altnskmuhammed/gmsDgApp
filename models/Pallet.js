// models/Pallet.js
const mongoose = require('mongoose');

const scannedWeightSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
});

const palletSchema = new mongoose.Schema({
  palletNumber: { type: String, required: true },
  weights: [scannedWeightSchema],
  ranges: [
    {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('Pallet', palletSchema);
