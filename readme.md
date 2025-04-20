# 🐟 GMS Digital Pallet Management System - Backend

## 📌 Proje Amacı

Bu proje, balık işleme tesislerinde strafor kutulara yapıştırılan barkodlu etiketlerin dijital olarak yönetilmesini ve takip edilmesini amaçlamaktadır. Geleneksel yöntemlerde, her strafor kutusunun ağırlığı elle yazılarak sonrasında bilgisayara manuel olarak aktarılmaktadır. Bu süreç zaman alıcı ve hata yapma olasılığı yüksek bir yöntemdir.

**GMS (Gümüşdoğa Management System)** ile bu işlemler mobil cihazlar ve bir backend altyapısı ile otomatik hale getirilmiştir. Sistemin temel fonksiyonları:

- Her strafor kutusu mobil uygulama aracılığıyla barkodla tanımlanır.
- Barkodu okunan straforlar ilgili kalibre ve palet içerisine otomatik olarak atanır.
- Paletler sistemde birer siparişi temsil eder.
- Paletlerin toplam kilosu, içindeki strafor sayısı, toplam palet adedi ve genel tonaj gibi veriler hızlı ve güvenilir bir şekilde sistem tarafından hesaplanır.
- İnsan hatası minimuma indirilir, zaman tasarrufu ve veri doğruluğu sağlanır.

## 🧰 Kullanılan Teknolojiler

- **Node.js & Express.js** – Sunucu tarafı uygulama geliştirme
- **MongoDB & Mongoose** – Veritabanı yönetimi
- **PubNub** – Gerçek zamanlı veri iletimi
- **dotenv** – Ortam değişkenleri yönetimi
- **uuid** – Benzersiz ID oluşturma
- **nodemon** – Geliştirme sürecinde otomatik sunucu yeniden başlatma

## 📁 Proje Yapısı

gmsDgApp/ ├── controllers/ # API mantıksal kontrolcüleri ├── env/ # Ortam değişkenleri ├── middleware/ # Özel middleware fonksiyonları ├── models/ # Mongoose şema tanımları ├── routes/ # Express router dosyaları ├── pubnubConfig.js # PubNub yapılandırması ├── server.js # Uygulamanın başlangıç noktası ├── package.json # Proje bağımlılıkları ve scriptler

bash
Kopyala
Düzenle

## ⚙️ Kurulum Talimatları

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/altnskmuhammed/gmsDgApp.git
cd gmsDgApp
###  2. Bağımlılıkları Yükleyin
bash
Kopyala
Düzenle
npm install
3. Ortam Değişkenlerini Ayarlayın
Ana dizine .env dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:

env
Kopyala
Düzenle
PORT=5000
MONGO_URI=mongodb://localhost:27017/gmsDgApp
PUBNUB_PUBLISH_KEY=your_pubnub_publish_key
PUBNUB_SUBSCRIBE_KEY=your_pubnub_subscribe_key
###  4. Sunucuyu Başlatın
bash
Kopyala
Düzenle
npm start
🔌 API Uç Noktaları

Yöntem	Uç Nokta	Açıklama
GET	/api/palets	Tüm paletleri getirir
POST	/api/palets	Yeni palet oluşturur
GET	/api/styrofoams	Tüm straforları getirir
POST	/api/styrofoams	Yeni strafor kaydeder
GET	/api/orders	Tüm siparişleri getirir
POST	/api/orders	Yeni sipariş oluşturur
Not: Tüm endpoint’ler ilgili controllers/ ve routes/ klasörlerinde detaylandırılmıştır.

📈 Fonksiyonel Özellikler
📦 Barkod tabanlı strafor tanımlama

🔢 Kalibre bazlı palet oluşturma

⚖️ Toplam kilo, adet, palet sayısı hesaplama

📑 Sipariş takibi ve detaylı raporlama

🔄 Gerçek zamanlı veri güncellemeleri (PubNub entegrasyonu)

⏱️ Hızlı veri erişimi ve minimum hata

📌 Gelecekteki Geliştirmeler
📊 CSV/Excel dışa aktarım özelliği

📺 Realtime dashboard (grafikler)

👥 Kullanıcı yönetimi ve rol bazlı yetkilendirme

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

📝 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için LICENSE dosyasını inceleyebilirsiniz.

📫 İletişim
Her türlü görüş, öneri veya işbirliği için:

GitHub: altnskmuhammed
📫 İletişim
Her türlü görüş, öneri veya işbirliği için:

GitHub: altnskmuhammed
