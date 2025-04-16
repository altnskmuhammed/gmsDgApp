const multer = require("multer");
const path = require("path");

// Yüklenen dosyaların kaydedileceği klasör
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // "uploads/" klasörüne kaydedilecek
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya adı
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
