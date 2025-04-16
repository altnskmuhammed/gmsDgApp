const mongoose = require("mongoose");

//Weight Schema: Her ağırlığın bir id ve değeri olacak
const weightSchemaRaw = new mongoose.Schema({
  weight: { type: Number, required: true }, // Kilo (kg)
  size: { type: String}, // Boyut (cm)
});

const rawMaterialsSchema = new mongoose.Schema({
  lot: { type: String, required: true }, // Lot ID
  isLast: { type: Boolean, required: true }, // Son ürün mü değil mi
  weights: [weightSchemaRaw], // Palet içindeki değişken sayıdaki kilo verileri
});

const rawMaterials = mongoose.model("rawMaterials", rawMaterialsSchema);

module.exports = rawMaterials;
