const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  vehicle: { type: String, required: true },
  images: [{ type: String }], // Resim URL'lerini saklamak için dizi
}, { timestamps: true });

module.exports = mongoose.model("RawSave", rawMaterialSchema);
