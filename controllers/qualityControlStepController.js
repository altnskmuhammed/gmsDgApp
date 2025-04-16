const mongoose = require("mongoose");
const Order = require("../models/Order");
const QualityControlStep = require("../models/QualityControlStep");
const multer = require("multer");
const path = require("path");

// Multer yapılandırması - Dosyaları `uploads/` klasörüne kaydedecek
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Kalite Kontrol Adımı Ekleme
const addQualityControlSteps = async (req, res) => {
    const { orderId, steps } = req.body; // steps dizisi olarak alınıyor
    
    try {
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        // Gelen her adımı ekle
        const newSteps = steps.map(step => ({
            stepName: step.stepName,
            description: step.description,
            status: step.status || 'beklemede', // Varsayılan olarak 'beklemede' ayarlıyoruz
        }));

        // Kalite kontrol adımlarını siparişe ekle
        order.qualityControlSteps.push(...newSteps);
        await order.save();

        res.status(201).json(newSteps);
    } catch (error) {
        res.status(400).json({ message: 'Adımlar eklenemedi', error });
    }
};

// Kalite Kontrol Adımlarını Listeleme
const getQualityControlSteps = async (req, res) => {
    const { orderId } = req.query;

    try {
        const order = await Order.findById(orderId).populate('qualityControlSteps');
        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        res.json(order.qualityControlSteps);
    } catch (error) {
        res.status(500).json({ message: 'Adımlar alınamadı', error });
    }
};

// Kalite Kontrol Adımı Güncelleme
const updateQualityControlStep = async (req, res) => {
    const { orderId, stepId, completedBy } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });

        const step = order.qualityControlSteps.id(stepId);
        if (!step) return res.status(404).json({ message: 'Adım bulunamadı' });

        step.status = 'tamamlandı';
        step.completedBy = completedBy;
        step.completionDate = new Date();

        await order.save();
        res.status(200).json(step);
    } catch (error) {
        res.status(400).json({ message: 'Adım güncellenemedi', error });
    }
};

const uploadAttachment = (req, res) => {
    // Tekli dosya yükleme için multer middleware'ini çağırın
    upload.single("mediaFiles")(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ message: "File upload error", error: err });
      }
  
      try {
        const { orderId, stepId } = req.params; // orderId ve stepId'yi URL'den alın
        console.log("OrderID:", orderId, "StepID:", stepId);
  
        // İlgili kalite kontrol adımını bulun
        const step = await QualityControlStep.findById(stepId);
        if (!step) {
          return res.status(404).json({ message: "Step not found" });
        }
  
        // Dosyanın medya verilerini kalite kontrol adımına ekleyin
        step.media.push({
          fileType: req.file.mimetype,
          filePath: req.file.path,
          orderId: orderId,
        });
  
        await step.save();
        
        
        const media = step.media.filter(m => m.orderId.toString() === orderId);
        
        res.status(200).json({
          message: "File uploaded successfully",
          media: media,
        });
      } catch (error) {
        console.error("Error during file upload:", error);
        res.status(400).json({ message: "File upload error", error });
      }
    });
  };
  
  // Yeni bir fonksiyon tanımlıyoruz:
  const getQualityControlStepMedia = async (req, res) => {
    const { orderId, stepId } = req.params;
    try {
        const step = await QualityControlStep.findOne({ _id: stepId });
      // Medya verisini filtrele
    const media = step.media.filter(m => m.orderId.toString() === orderId);
        console.log("Step Found by stepId:", step);
        console.log("Media Found by orderId:", media);
        if (!step) return res.status(404).json({ message: "Adım veya sipariş bulunamadı" });
    
        res.status(200).json(media);
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ message: "Medya yüklenirken hata oluştu", error });
    }
};




  

module.exports = {
    addQualityControlSteps,
    getQualityControlSteps,
    updateQualityControlStep,
    uploadAttachment,
    getQualityControlStepMedia
};
