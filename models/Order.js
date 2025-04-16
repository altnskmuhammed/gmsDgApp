const mongoose = require("mongoose");

//Weight Schema: Her ağırlığın bir id ve değeri olacak
const weightSchema = new mongoose.Schema({
  lot: { type: String }, // Lot ID
  weight: { type: Number, required: true }, // Kilo (kg)
});

const palletSchema = new mongoose.Schema({
  palletNumber: Number,
  weights: [weightSchema], // Palet içindeki değişken sayıdaki kilo verileri
  ranges: [
    {
      min: Number, // Aralığın başlangıcı
      max: Number, // Aralığın bitişi
    },
  ], // Aralıklar için bir dizi
});

const orderSchema = new mongoose.Schema({
  orderName: String,
  range_1000_1500: { type: Number, required: true },
  range_1500_2000: { type: Number, required: true },
  range_2000_3000: { type: Number, required: true },
  range_3000_4000: { type: Number, required: true },
  range_4000_5000: { type: Number, required: true },
  min_kg: { type: Number, required: true },
  max_kg: { type: Number, required: true },
  orderNumber: { type: String, unique: true }, // Benzersiz bir sipariş numarası
  orderDate: { type: Date, default: Date.now }, // Sipariş tarihi
  qualityControlSteps: [
    { type: mongoose.Schema.Types.ObjectId, ref: "QualityControlStep" },
  ],
  pallets: [palletSchema], // 32 palet bilgisi
  status: {
    type: String,
    enum: ["beklemede", "onaylandı"],
    default: "beklemede",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
