const RawMaterials = require("../models/rawMaterials");


// Yeni ham madde ekleme
exports.addRawMaterial = async (req, res) => {
  try {
    const { lot, weights, isLast } = req.body;

    console.log("📌 Gelen İstek:", req.body);

    // Gelen weights içinde size boş olanları kontrol et ve uygun size'ı ata
    const updatedWeights = weights.map((item) => {
      if (!item.size || item.size.trim() === "") {
        if (item.weight >= 0 && item.weight < 1000) {
          item.size = "0-1000";
        } else if (item.weight >= 1000 && item.weight < 2000) {
          item.size = "1000-2000";
        } else if (item.weight >= 2000 && item.weight < 3000) {
          item.size = "2000-3000";
        } else if (item.weight >= 3000 && item.weight < 4000) {
          item.size = "3000-4000";
        } else if (item.weight >= 4000 && item.weight < 5000) {
          item.size = "4000-5000";
        }
      }
      return item;
    });

    console.log("🔄 Güncellenmiş Weights:", updatedWeights);

    // Aynı `lot` numarasına sahip en son kaydı bul
    const lastMaterial = await RawMaterials.findOne({ lot }).sort({ createdAt: -1 });
    console.log("🛑 Son Kayıt:", lastMaterial);

    if (lastMaterial) {
      if (lastMaterial.isLast) {
        console.log("✅ Önceki kayıt isLast = true, yeni weight'ler ekleniyor...");

        lastMaterial.weights = [...lastMaterial.weights, ...updatedWeights];
        await lastMaterial.save();

        console.log("🔄 Güncellenmiş Veri:", lastMaterial);

        return res.status(200).json({ message: "OK TAMAM", status: 0 });
      } else {
        console.log("⚠️ Önceki kayıt isLast = false, eski kayıt silinip yeni kayıt oluşturuluyor...");

        const mergedWeights = [...lastMaterial.weights, ...updatedWeights];
        console.log("🔗 Birleşmiş Weights:", mergedWeights);

        await RawMaterials.findByIdAndDelete(lastMaterial._id);
        console.log("🗑️ Eski kayıt silindi:", lastMaterial._id);

        const newMaterial = new RawMaterials({
          ...req.body,
          weights: mergedWeights,
          isLast: isLast,
        });

        await newMaterial.save();
        console.log("✅ Yeni Kayıt Oluşturuldu:", newMaterial);

        return res.status(201).json({ message: "OK TAMAM", status: 0 });
      }
    }

    console.log("🆕 İlk kez bu lot numarasıyla kayıt yapılıyor...");

    const newMaterial = new RawMaterials({ ...req.body, weights: updatedWeights, isLast: isLast });
    await newMaterial.save();

    console.log("✅ Yeni İlk Kayıt:", newMaterial);

    res.status(201).json({ message: "OK TAMAM", status: 0 });

  } catch (error) {
    console.error("❌ Kayıt Hatası:", error);
    res.status(400).json({ message: error.message, status: 1 });
  }
};


// Tüm ham maddeleri listeleme
exports.getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterials.find();
    console.log("RAWWWWWW",rawMaterials);
    
    res.json(rawMaterials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir ham maddeyi ID ile getirme
exports.getRawMaterialById = async (req, res) => {
  try {
    const rawMaterial = await RawMaterials.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });
    res.json(rawMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ham maddeyi güncelleme
exports.updateRawMaterial = async (req, res) => {
  try {
    const updatedRawMaterial = await RawMaterials.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });
    res.json(updatedRawMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ham maddeyi silme
exports.deleteRawMaterial = async (req, res) => {
  try {
    const deletedRawMaterial = await RawMaterials.findByIdAndDelete(req.params.id);
    if (!deletedRawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });
    res.json({ message: "Ham madde silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Yeni kilo verisi ekleme **
exports.addWeight = async (req, res) => {
  try {
    const {  weight, size } = req.body;
    const rawMaterial = await RawMaterials.findById(req.params.id);

    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    rawMaterial.weights.push({  weight, size });
    await rawMaterial.save();

    res.json(rawMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Belirli bir kilo verisini silme (lot numarasına göre) **
exports.deleteWeight = async (req, res) => {
  try {
    const rawMaterial = await RawMaterials.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    rawMaterial.weights = rawMaterial.weights.filter(weight => weight.lot !== req.params.lot);
    await rawMaterial.save();

    res.json(rawMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Tüm kilo verilerini güncelleme **
exports.updateWeights = async (req, res) => {
  try {
    const rawMaterial = await RawMaterials.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    rawMaterial.weights = req.body.weights;
    await rawMaterial.save();

    res.json(rawMaterial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Toplam ağırlık hesaplama **
exports.calculateTotalWeight = async (req, res) => {
  try {
    const rawMaterial = await RawMaterials.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    const totalWeight = rawMaterial.weights.reduce((sum, item) => sum + item.weight, 0);
    res.json({ totalWeight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ** Boyut ortalamasını hesaplama **
exports.calculateAverageSize = async (req, res) => {
  try {
    const rawMaterial = await RawMaterials.findById(req.params.id);
    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    if (rawMaterial.weights.length === 0) {
      return res.json({ averageSize: 0 });
    }

    const totalSize = rawMaterial.weights.reduce((sum, item) => sum + item.size, 0);
    const averageSize = totalSize / rawMaterial.weights.length;

    res.json({ averageSize });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
