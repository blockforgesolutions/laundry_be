# AquaWash - Çamaşırhane Yönetim Sistemi

Modern ve kullanıcı dostu çamaşırhane yönetim sistemi. Backend Node.js/Express/TypeScript, Frontend React/TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

### Backend

- **Müşteri Yönetimi**: Müşteri ekleme ve listeleme
- **Randevu Sistemi**: Çamaşır getirme randevuları
- **Çamaşır Takibi**: Durumu takip etme (yıkanıyor/hazır/teslim edildi)
- **Raf Kodları**: Hazır çamaşırlar için raf kodu sistemi
- **SMS Bildirimleri**: Çamaşır hazır olduğunda otomatik SMS (Twilio)
- **SQLite Veritabanı**: Hafif ve pratik veri depolama
- **Swagger Dokümantasyonu**: API dokümantasyonu

### Frontend

- **Modern Tasarım**: Responsive ve kullanıcı dostu arayüz
- **Dashboard**: Anlık istatistikler ve son aktiviteler
- **Müşteri Yönetimi**: Müşteri ekleme ve arama
- **Randevu Sistemi**: Zaman dilimi oluşturma ve randevu alma
- **Çamaşır Takibi**: Durum güncelleme ve filtreleme
- **Real-time Updates**: Anlık veri güncellemeleri

## 📋 Gereksinimler

- Node.js (v16 veya üstü)
- npm veya yarn

## 🛠️ Kurulum

### Backend Kurulumu

1. Ana dizinde bağımlılıkları yükleyin:

```bash
npm install
```

2. Veritabanını seed edin (opsiyonel):

```bash
npm run seed
```

3. Backend'i başlatın:

```bash
npm run dev
```

Backend http://localhost:3000 adresinde çalışacak.

### Frontend Kurulumu

1. Frontend dizinine gidin:

```bash
cd frontend
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Frontend'i başlatın:

```bash
npm start
```

Frontend http://localhost:3001 adresinde çalışacak.

## 📡 API Endpoints

### Müşteriler

- `GET /customers` - Tüm müşterileri listele
- `POST /customers` - Yeni müşteri ekle
- `GET /customers/:phone` - Telefon numarasına göre müşteri bul

### Randevu Slotları

- `GET /ring-slots` - Tüm zaman dilimlerini listele
- `POST /ring-slots` - Yeni zaman dilimi ekle
- `POST /ring-appointments` - Randevu oluştur

### Çamaşır Takibi

- `GET /laundry` - Çamaşırları listele (status parametresi ile filtreleme)
- `POST /laundry` - Yeni çamaşır ekle
- `PUT /laundry/:id` - Çamaşır durumunu güncelle
- `GET /laundry/with-customer` - Müşteri bilgileriyle birlikte çamaşırları listele

## 📚 API Dokümantasyonu

Backend çalıştıktan sonra Swagger dokümantasyonuna erişebilirsiniz:
http://localhost:3000/docs

## 🎨 Frontend Sayfaları

- **Ana Sayfa (Dashboard)**: İstatistikler ve son aktiviteler
- **Müşteriler**: Müşteri listesi ve yeni müşteri ekleme
- **Randevular**: Zaman dilimi yönetimi ve randevu oluşturma
- **Çamaşırlar**: Çamaşır durumu takibi ve güncelleme

## 🔧 Teknolojiler

### Backend

- Node.js
- Express.js
- TypeScript
- SQLite3
- Swagger (API dokümantasyonu)
- Twilio (SMS)
- CORS

### Frontend

- React 18
- TypeScript
- Styled Components
- React Router DOM
- Axios
- Lucide React (ikonlar)

## 📱 SMS Yapılandırması

SMS özelliğini kullanmak için `.env` dosyası oluşturun:

```env
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Not: Şu anda SMS fonksiyonu dummy mode'dadır. Gerçek SMS göndermek için `src/utils/sendSMS.ts` dosyasındaki yorum satırlarını kaldırın.

## 🚀 Kullanım

1. Backend ve frontend'i başlatın
2. Frontend'e http://localhost:3001 adresinden erişin
3. İlk olarak müşteri ekleyin
4. Randevu zaman dilimler oluşturun
5. Çamaşır ekleyip durumlarını takip edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
