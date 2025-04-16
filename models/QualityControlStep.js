const mongoose = require("mongoose");

// QualityControlStep Schema tanımı
const QualityControlStepSchema = new mongoose.Schema({
  stepName: { type: String, required: true },
  description: { type: String },
  media: [
    {
      fileType: { type: String, required: true },
      filePath: { type: String, required: true },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    },
  ],
  applicableOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  status: {
    type: String,
    enum: ["beklemede", "tamamlandı"],
    default: "beklemede",
  },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completionDate: { type: Date },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: false,
  },
});

// Modeli oluşturma
const QualityControlStep = mongoose.model("QualityControlStep", QualityControlStepSchema);

module.exports = QualityControlStep; // Modeli dışa aktarma
