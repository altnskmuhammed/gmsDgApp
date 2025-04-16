const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Erişim reddedildi: Token bulunamadı." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Geçersiz token." });
    }
    req.user = user; // Token geçerli ise, kullanıcıyı isteğe ekliyoruz
    next(); // Middleware işlemi başarılı, bir sonraki adıma geç
  });
};

module.exports = authenticateToken;
