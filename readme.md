# 🐟 GMS Digital Pallet Management System - Backend

## 📌 Proje Amacı

Bu proje, balık işleme tesislerinde strafor kutulara yapıştırılan barkodlu etiketlerin dijital olarak yönetilmesini ve takip edilmesini amaçlamaktadır. Geleneksel yöntemlerde, her strafor kutusunun ağırlığı elle yazılarak sonrasında bilgisayara manuel olarak aktarılmaktadır. Bu süreç zaman alıcı ve hata yapma olasılığı yüksek bir yöntemdir.

**GMS (Gümüşdoğa Management System)** ile bu işlemler mobil cihazlar ve bir backend altyapısı ile otomatik hale getirilmiştir. Sistemin temel fonksiyonları:

- Her strafor kutusu mobil uygulama aracılığıyla barkodla tanımlanır.
- Barkodu okunan straforlar ilgili kalibre ve palet içerisine otomatik olarak atanır.
- Paletler sistemde bir siparişin parçalarını temsil eder.
- Paletlerin toplam kilosu, içindeki strafor sayısı, toplam palet adedi ve genel tonaj gibi veriler hızlı ve güvenilir bir şekilde sistem tarafından hesaplanır.
- İnsan hatası minimuma indirilir, zaman tasarrufu ve veri doğruluğu sağlanır.

## 🧰 Kullanılan Teknolojiler

- **Node.js & Express.js** – Sunucu tarafı uygulama geliştirme
- **MongoDB & Mongoose** – Veritabanı yönetimi
- **dotenv** – Ortam değişkenleri yönetimi
- **uuid** – Benzersiz ID oluşturma
- **nodemon** – Geliştirme sürecinde otomatik sunucu yeniden başlatma

## 📁 Proje Yapısı

gmsDgApp/ ├── controllers/ # API mantıksal kontrolcüleri ├── env/ # Ortam değişkenleri ├── middleware/ # Özel middleware fonksiyonları ├── models/ # Mongoose şema tanımları ├── routes/ # Express router dosyaları  ├── server.js # Uygulamanın başlangıç noktası ├── package.json # Proje bağımlılıkları ve scriptler


## ⚙️ Kurulum Talimatları

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/altnskmuhammed/gmsDgApp.git
cd gmsDgApp
```
###  2. Bağımlılıkları Yükleyin
```bash
npm install
```
 ###  3. Ortam Değişkenlerini Ayarlayın
Ana dizine .env dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/gmsDgApp
```
###  4. Sunucuyu Başlatın
```bash
npm start
```
## 🔌 API Uç Noktaları

| Yöntem | Uç Nokta                                           | Açıklama                        |
|--------|----------------------------------------------------|---------------------------------|
| POST   | /register                                          | Kullanıcı Oluşturma             |
| GET    | /api/login                                         | Kullanıcı Giriş Yapma           |
| PUT    | /api/users/:id/role                                | Kullanıcı Rol Güncelleme        |
| GET    | /api/orders                                        | Tüm siparişleri getirir         |
| GET    | /api/orders/:id                                    | Belirli bir id'ye göre sipariş  |
| DELETE | /api/orders/:orderId/pallets/:palletId             | Palet Silme                     |
| POST   | /api/orders/:orderId/pallets                       | Palet Ekleme                    |
| POST   | /api/orders                                        | Sipariş Oluşturma               |
| DELETE | /api/orders/:orderId/pallets/:palletNumber/weights | Kilo Silme                      |
| PUT    | /api/orders/:orderId/pallets/:palletId             | Palet Düzenleme                 |
| GET    | /api/orders/:orderId/pallets/:palletId             | Palet Getirme                   |
| PUT    | /api/orders/:orderId                               | Sipariş Status Güncelleme       |
| POST   | /api/export/export-to-excel                        | Paleti Excel'e Aktarma          |
| POST   | /api/export-to-excel-summary                       | Tüm Paletlerin Özetini Aktarma  |
| POST   | /api/roles                                         | Rol Ekleme                      |
| GET    | /api/roles                                         | Rolleri Getirme                 |
| PUT    | /api/roles/:id                                     | Rol Güncelleme                  |
| DELETE | /api/roles/:id                                     | Rol Silme                       |

Not: Tüm endpoint’ler ilgili controllers/ ve routes/ klasörlerinde detaylandırılmıştır.

📈 Fonksiyonel Özellikler
📦 Barkod tabanlı strafor tanımlama

🔢 Kalibre bazlı palet oluşturma

⚖️ Toplam kilo, adet, palet sayısı hesaplama

📑 Sipariş takibi ve detaylı raporlama

📊 CSV/Excel dışa aktarım özelliği

👥 Kullanıcı yönetimi ve rol bazlı yetkilendirme

⏱️ Hızlı veri erişimi ve minimum hata

📌 Gelecekteki Geliştirmeler


📺 Realtime dashboard (grafikler)

⚙️ IoT tartı cihazları ile otomatik veri girişi

🗃️ Geçmiş sipariş arşivleme ve belge çıktıları (irsaliye/fatura)

👨‍💻 Katkı Sağlamak
Projeye katkıda bulunmak için:

Bu repoyu fork'layın.

Yeni bir özellik veya düzeltme için branch oluşturun:
git checkout -b feature/yeni-ozellik

Değişikliklerinizi commit edin:
git commit -m "Yeni özellik eklendi"

Branch’i push’layın:
git push origin feature/yeni-ozellik

Pull request gönderin.


📫 İletişim
Her türlü görüş, öneri veya işbirliği için:

GitHub: altnskmuhammed

