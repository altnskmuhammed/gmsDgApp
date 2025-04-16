const RawSave = require("../models/RawSave");

// Yeni ham madde ekleme
exports.createRawMaterial = async (req, res) => {
  try {
    const { name, amount, vehicle } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
console.log("body",req.body);

    const newMaterial = new RawSave({ name, amount, vehicle, images });
    await newMaterial.save();

    res.status(201).json({ success: true, data: newMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası", error });
  }
};

// Tüm ham maddeleri getirme
exports.getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawSave.find();
    console.log("raw",rawMaterials);
    
    res.status(200).json({ success: true, data: rawMaterials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası", error });
  }
};

// Tek ham maddeyi getirme
exports.getRawMaterialById = async (req, res) => {
  try {
    const rawMaterial = await RawSave.findById(req.params.id);
    if (!rawMaterial) {
      return res.status(404).json({ success: false, message: "Ham madde bulunamadı" });
    }
    res.status(200).json({ success: true, data: rawMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası", error });
  }
};

// Ham maddeyi güncelleme
exports.updateRawMaterial = async (req, res) => {
  try {
    const { name, amount, vehicle } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const updatedMaterial = await RawSave.findByIdAndUpdate(
      req.params.id,
      { name, amount, vehicle, $push: { images: { $each: images } } },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ success: false, message: "Ham madde bulunamadı" });
    }

    res.status(200).json({ success: true, data: updatedMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası", error });
  }
};

// Ham maddeyi silme
exports.deleteRawMaterial = async (req, res) => {
  try {
    const deletedMaterial = await RawSave.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) {
      return res.status(404).json({ success: false, message: "Ham madde bulunamadı" });
    }
    res.status(200).json({ success: true, message: "Ham madde silindi" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası", error });
  }
};
