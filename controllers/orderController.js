const Order = require("../models/Order");
const QualityControlStep = require("../models/QualityControlStep");
const mongoose = require("mongoose");
const defaultQualityControlSteps = [
  { stepName: "Görünüm", description: "Numune ürün", status: "beklemede" },
  {
    stepName: "Balık Yemlimi",
    description: "Balık da yem varmı?",
    status: "beklemede",
  },
  {
    stepName: "Balık Yumurta Oranı",
    description: "Balık yumurta oranı",
    status: "beklemede",
  },
  {
    stepName: "Deforme",
    description: "Balık deforme oranı",
    status: "beklemede",
  },
  {
    stepName: "Terazı Kontrolü",
    description: "Terazı kilo kontrolü",
    status: "beklemede",
  },
  {
    stepName: "Pakete Giriş SIcaklığı",
    description: "Terazı kilo kontrolü",
    status: "beklemede",
  },

  // Diğer adımlar
];
// , derece yem ymurta kontrolu ,solungac ,
// Sipariş Numarası Üretme Fonksiyonu

// Sipariş Numarası Üretme Fonksiyonu
const generateOrderNumber = async (orderName) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Aynı gün içinde aynı sipariş adı ile kaç sipariş olduğunu sayın
  const orderCount = await Order.countDocuments({
    orderName: orderName,
    orderDate: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Günün başlangıcından
      $lt: new Date(new Date().setHours(24, 0, 0, 0)), // Günün sonuna kadar
    },
  });

  // Sipariş numarasını oluşturun (örn. JSC-20240811-1, JSC-20240811-2)
  const orderNumber = `${orderName}-${date}-${orderCount + 1}`;

  return orderNumber;
};
// Sipariş Durumunu Güncelleme
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // "onaylandı" veya "beklemede"

  // Geçerli statüler
  const validStatuses = ["beklemede", "onaylandı"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Geçersiz durum." });
  }

  try {
    // Siparişi bul
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Durumu güncelle
    order.status = status;

    // Güncellenmiş siparişi kaydet
    await order.save();

    // Güncellenmiş siparişi yanıt olarak döndür
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sipariş Oluşturma
const createOrder = async (req, res) => {
  const {
    orderName,
    pallets,
    ranges,
    range_1000_1500,
    range_1500_2000,
    range_2000_3000,
    range_3000_4000,
    range_4000_5000,
    min_kg,
    max_kg, 
  } = req.body;

  const orderNumber = await generateOrderNumber(orderName);

  // Yeni sipariş oluştur
  const newOrder = new Order({
    orderName,
    range_1000_1500,
    range_1500_2000,
    range_2000_3000,
    range_3000_4000,
    range_4000_5000,
    min_kg,
    max_kg,
    orderNumber,
    orderDate: new Date(),
    pallets,
    ranges,
    status: "beklemede",
  });

  try {
    // Siparişi kaydedin ki bir orderId alabilelim
    const order = await newOrder.save();

    // Varsayılan kalite kontrol adımlarını al
    const defaultSteps = await QualityControlStep.find();

    // Her siparişe varsayılan kalite kontrol adımlarını ekle
    order.qualityControlSteps = defaultSteps.map((step) => step._id);

    await order.save();
    const orderWithSteps = await Order.findById(order._id).populate({
      path: "qualityControlSteps",
      sellect: "_id stepName",
    });

    res.status(201).json(orderWithSteps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tüm Siparişleri Getirme
const getAllOrders = async (req, res) => {
  try {
    // Tüm siparişleri veritabanından alın
    const orders = await Order.find();

    // Siparişler başarıyla alındıysa, yanıt olarak gönderin
    res.status(200).json(orders);
  } catch (err) {
    // Hata durumunda, uygun bir hata mesajı döndürün
    res.status(500).json({ message: err.message });
  }
};
const addPalletToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { palletNumber, weights, ranges } = req.body;

  // Ranges formatını kontrol et
  if (
    !Array.isArray(ranges) ||
    ranges.some((range) => !range.min || !range.max)
  ) {
    return res.status(400).json({
      message:
        "Invalid ranges format. Each range must have 'min' and 'max' values.",
    });
  }

  try {
    // Siparişi bul
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Yeni paleti ekle
    const newPallet = { palletNumber, weights, ranges };
    order.pallets.push(newPallet);

    // Değişiklikleri kaydet
    await order.save();

    // Eklenen paleti al (en son eklenen palet)
    const addedPallet = order.pallets[order.pallets.length - 1];

    // Eklenen paleti yanıt olarak gönder
    res.status(200).json(addedPallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removePalletFromOrder = async (req, res) => {
  const { orderId, palletId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.pallets = order.pallets.filter(
      (pallet) => pallet._id.toString() !== palletId
    );
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updatePalletInOrder = async (req, res) => {
  const { orderId, palletId } = req.params;
  const { palletNumber, weights } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pallet = order.pallets.id(palletId);

    if (!pallet) {
      return res.status(404).json({ message: "Pallet not found" });
    }

    pallet.palletNumber = palletNumber || pallet.palletNumber;
    // Weights alanını güncelle
    if (weights && Array.isArray(weights)) {
      pallet.weights = weights.map((weight) => ({
        lot: weight.lot || undefined,
        weight: weight.weight,
        _id: weight._id || new mongoose.Types.ObjectId(), // Yeni bir `_id` oluştur eğer yoksa
      }));
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPaletById = async (req, res) => {
  const { orderId, palletId } = req.params;

  try {
    // Siparişi bul
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Paleti bul
    const pallet = order.pallets.id(palletId);

    if (!pallet) {
      return res.status(404).json({ message: "Pallet not found" });
    }

    // Sadece paleti JSON olarak döndür
    res.status(200).json(pallet);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
const removeWeights = async (req, res) => {
  try {
    const { orderId, palletNumber } = req.params; // Parametrelerden sipariş ve palet bilgisi
    const { weightsToRemove } = req.body; // Silinecek ağırlık bilgisi istek gövdesinden alınır

    if (!weightsToRemove || weightsToRemove.length === 0) {
      return res
        .status(400)
        .json({
          message: "weightsToRemove is required and should not be empty",
        });
    }

    // Weights dizisinde her bir ağırlık için işlemi tekrarlıyoruz
    for (let weight of weightsToRemove) {
      // Ağırlığı sadece bir kez sil
      await Order.updateOne(
        { _id: orderId, "pallets.palletNumber": palletNumber },
        { $pull: { "pallets.$.weights": weight } }, // İlk eşleşen öğeyi sil
        { multi: false } // multi: false => sadece bir öğe silinecek
      );
    }

    res
      .status(200)
      .json({
        message: "Kilo verisi başarıyla silindi",
        removedWeights: weightsToRemove,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const findOrderWithId = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "qualityControlSteps",
      sellect: "_id stepName",
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createOrder,
  addPalletToOrder,
  removePalletFromOrder,
  updatePalletInOrder,
  getAllOrders,
  findOrderWithId,
  getPaletById,
  updateOrderStatus,
  removeWeights,
};
// Diğer sipariş kontrolcü işlevleri de buraya eklenebilir
