const QualityControlStep = require('../models/QualityControlStep');

const loadDefaultQualityControlSteps = async () => {
    const defaultQualityControlSteps = [
      { stepName: "Görünüm", description: "Numune ürün", status: "beklemede" },
      { stepName: "Balık Yemlimi", description: "Balık da yem varmı?", status: "beklemede" },
      { stepName: "Balık Yumurta Oranı", description: "Balık yumurta oranı", status: "beklemede" },
      { stepName: "Deforme", description: "Balık deforme oranı", status: "beklemede" },
      { stepName: "Terazı Kontrolü", description: "Terazı kilo kontrolü", status: "beklemede" },
      { stepName: "Pakete Giriş Sıcaklığı", description: "Terazı kilo kontrolü", status: "beklemede" },
    ];

    try {
        const existingSteps = await QualityControlStep.find();

        if (existingSteps.length === 0) {
            await QualityControlStep.insertMany(defaultQualityControlSteps);
            console.log('Varsayılan kalite kontrol adımları başarıyla yüklendi.');
        } else {
            console.log('Kalite kontrol adımları zaten mevcut.');
        }
    } catch (error) {
        console.error('Varsayılan adımlar yüklenirken hata oluştu:', error);
    }
};

module.exports = loadDefaultQualityControlSteps; // Dışa aktarım