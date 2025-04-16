const mongoose = require("mongoose");

//Weight Schema: Her ağırlığın bir id ve değeri olacak
const weightSchemaRaw = new mongoose.Schema({
 
  weight: { type: Number, required: true }, // Kilo (kg)
  size: { type: String, required: true }, // Boyut (cm)
});



const process1Schema = new mongoose.Schema({
    lot: { type: String, required: true }, // Lot ID
isLast: { type: Boolean, required: true }, // Son ürün mü değil mi
weights: [weightSchemaRaw], // Palet içindeki değişken sayıdaki kilo verileri
});

const process1 = mongoose.model("process1", process1Schema);

module.exports = process1;
