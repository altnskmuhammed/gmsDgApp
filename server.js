const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const path = require('path');
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/order");
// Değişiklik yapıldı
const loadDefaultQualityControlSteps = require('./env/loadDefaultQualityControlSteps'); // Doğru içe aktarma
const boatChecklistRoutes = require('./routes/boatCheckListRoutes');
const exportRoutes = require('./routes/exportExcellRoutes');
const authenticateToken = require("./middleware/authenticateToken");
const qualityControlStepRoutes = require('./routes/qualityControlStepRoutes');
const chatRoutes = require('./routes/chatRoutes');
const roleRoutes = require('./routes/roleRoutes');
const reportRoutes = require('./routes/reportRoutes');
const rawMaterialsRoutes = require("./routes/rawMaterialsRoutes");
const rawSaveRoutes = require("./routes/rawSaveRoutes");
const process1Routes = require("./routes/process1Routes");
require("dotenv").config();
const wihiteList = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (wihiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Bu adrese izin verilmiyor"));
    }
  },
};
//Middleware for parse json bodies
app.use(express.json({ limit: "10mb" }));  
// Form verilerini ayrıştırmak için middleware
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//cors origin resource sharing(CORS)
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Yüklenen resimleri sunmak için



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Veritabanına bağlanıldı.');
    // Varsayılan kalite kontrol adımlarını yükle
    loadDefaultQualityControlSteps();
})
  .catch((error) => console.error("MongoDB connection error:", error));





// Routes
app.use("/register", require("./routes/register"));
app.use("/api", require("./routes/auth"));
app.use("/api", orderRoutes);
app.use('/chat', chatRoutes);
app.use('/api', roleRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/boatCheckList', boatChecklistRoutes);
app.use('/api/quality-control-steps', qualityControlStepRoutes);
app.use("/api/raw-materials", rawMaterialsRoutes); 
app.use("/api/raw-save", rawSaveRoutes);
app.use("/api/process1", process1Routes); 

app.use('/api', reportRoutes);
// app.js veya sunucu dosyanızda
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`server is running on port ${port}`);
});
