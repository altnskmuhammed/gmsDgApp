const RawMaterials = require("../models/process1");

// Yeni ham madde ekleme
exports.addRawMaterial = async (req, res) => {
  try {
    const { lot, weights, isLast } = req.body;

    console.log("📌 Gelen İstek:", req.body);

    // Aynı `lot` numarasına sahip en son kaydı bul
    const lastMaterial = await RawMaterials.findOne({ lot }).sort({ createdAt: -1 });
    console.log("🛑 Son Kayıt:", lastMaterial);

    if (lastMaterial) {
      if (lastMaterial.isLast) {
        // **1️⃣ Önceki isLast = true ise**, yeni weight'leri ekleyip kaydediyoruz.
        console.log("✅ Önceki kayıt isLast = true, yeni weight'ler ekleniyor...");
        
        lastMaterial.weights = [...lastMaterial.weights, ...weights];
        await lastMaterial.save();

        console.log("🔄 Güncellenmiş Veri:", lastMaterial);

        return res.status(200).json({ message: "OK", data: lastMaterial });
      } else {
        // **2️⃣ Önceki isLast = false ise**, önceki kaydın weights dizisini birleştir ve eskiyi sil.
        console.log("⚠️ Önceki kayıt isLast = false, eski kayıt silinip yeni kayıt oluşturuluyor...");

        const mergedWeights = [...lastMaterial.weights, ...weights];
        console.log("🔗 Birleşmiş Weights:", mergedWeights);

        // Önceki kaydı sil
        await RawMaterials.findByIdAndDelete(lastMaterial._id);
        console.log("🗑️ Eski kayıt silindi:", lastMaterial._id);

        // Yeni kaydı isLast = true olarak oluştur
        const newMaterial = new RawMaterials({
          ...req.body,
          weights: mergedWeights,
          isLast: true,
        });

        await newMaterial.save();
        console.log("✅ Yeni Kayıt Oluşturuldu:", newMaterial);

        return res.status(201).json({ message: "OK", data: newMaterial });
      }
    }

    // **3️⃣ Eğer bu lot numarasıyla ilk kez veri geliyorsa, yeni kayıt oluştur**
    console.log("🆕 İlk kez bu lot numarasıyla kayıt yapılıyor...");

    const newMaterial = new RawMaterials({ ...req.body, isLast: true });
    await newMaterial.save();

    console.log("✅ Yeni İlk Kayıt:", newMaterial);

    res.status(201).json({ message: "OK", data: newMaterial });

  } catch (error) {
    console.error("❌ Kayıt Hatası:", error);
    res.status(400).json({ message: "Kayıt Hatası", error: error.message });
  }
};

// Tüm ham maddeleri listeleme
exports.getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterials.find();
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
    const { lot, weight, size } = req.body;
    const rawMaterial = await RawMaterials.findById(req.params.id);

    if (!rawMaterial) return res.status(404).json({ message: "Veri bulunamadı" });

    rawMaterial.weights.push({ lot, weight, size });
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
