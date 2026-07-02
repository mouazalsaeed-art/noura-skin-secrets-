# Noura Skin Secrets - API Server

خادم API متكامل لتطبيق Noura Skin Secrets مبني باستخدام Node.js و Express و MongoDB.

## المميزات

✅ مصادقة المستخدمين (JWT)  
✅ إدارة الخدمات والعروض  
✅ نظام حجز المواعيد المتقدم  
✅ نظام التقييمات والتعليقات  
✅ تكامل Stripe للدفع الآمن  
✅ لوحة تحكم المسؤول  
✅ قاعدة بيانات MongoDB منظمة  

## المتطلبات

- Node.js 16+
- MongoDB (محلي أو عن بعد)
- Stripe Account (للدفع)

## التثبيت

### 1. تثبيت الحزم
```bash
cd server
npm install
```

### 2. إعداد متغيرات البيئة
```bash
cp .env.example .env
# عدّل قيم البيانات في .env
```

### 3. تشغيل قاعدة البيانات

#### على نظام لينكس/ماك:
```bash
# تثبيت MongoDB
brew install mongodb-community

# تشغيل MongoDB
brew services start mongodb-community

# أو يدويًا
mongod
```

#### على Windows:
```bash
# تحميل من: https://www.mongodb.com/try/download/community
# اتبع معالج التثبيت
```

### 4. بذر قاعدة البيانات
```bash
npm run dev
# في نافذة أخرى:
npx ts-node src/seeds/seedDatabase.ts
```

## تشغيل الخادم

### بيئة التطوير:
```bash
npm run dev
```

### الإنتاج:
```bash
npm run build
npm start
```

## هيكل API

### المصادقة

#### تسجيل مستخدم جديد
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "الاسم",
  "email": "email@example.com",
  "phone": "+966501234567",
  "password": "Password123!"
}
```

#### تسجيل الدخول
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### الخدمات

#### الحصول على جميع الخدمات
```
GET /api/services
```

#### البحث عن خدمات
```
GET /api/services/search?q=تنظيف
```

#### الحصول على خدمة معينة
```
GET /api/services/{serviceId}
```

#### إنشاء خدمة (أدمن فقط)
```
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "الخدمة",
  "description": "وصف",
  "price": 150,
  "duration": 60,
  "category": "التصنيف",
  "image": "https://...",
  "discount": 0
}
```

### المواعيد

#### الحصول على المواعيد
```
GET /api/appointments
Authorization: Bearer {token}
```

#### إنشاء موعد
```
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "...",
  "serviceName": "الخدمة",
  "date": "2026-07-15",
  "time": "10:30",
  "notes": "ملاحظات",
  "price": 150
}
```

#### تحديث موعد
```
PATCH /api/appointments/{appointmentId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2026-07-20",
  "time": "14:00",
  "notes": "ملاحظات جديدة"
}
```

#### إلغاء موعد
```
DELETE /api/appointments/{appointmentId}
Authorization: Bearer {token}
```

### الدفع (Stripe)

#### إنشاء بيانات دفع
```
POST /api/payments/intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointmentId": "..."
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxxxx",
  "paymentIntentId": "pi_xxxxx"
}
```

#### تأكيد الدفع
```
POST /api/payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxx"
}
```

### التقييمات

#### الحصول على تقييمات الخدمة
```
GET /api/reviews/service/{serviceId}
```

**Response:**
```json
{
  "reviews": [ ... ],
  "avgRating": "4.5",
  "totalReviews": 12
}
```

#### إضافة تقييم
```
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "...",
  "clientName": "الاسم",
  "rating": 5,
  "comment": "تقييم رائع!"
}
```

## بيانات الاختبار

عند بذر قاعدة البيانات، يتم إنشاء:

**حساب المسؤول:**
- البريد: admin@nouraskin.com
- كلمة المرور: ChangeMe123!

**حساب العميل:**
- البريد: client@nouraskin.com
- كلمة المرور: Test123!

**الخدمات:**
- 6 خدمات جاهزة للاختبار

## هيكل قاعدة البيانات

### Users Collection
- _id
- name
- email
- phone
- password
- profileImage
- skinType
- allergies
- totalSpent
- role (client/admin)
- isActive
- timestamps

### Services Collection
- _id
- name
- description
- price
- duration
- category
- image
- discount
- isActive
- timestamps

### Appointments Collection
- _id
- userId (ref)
- serviceId (ref)
- serviceName
- date
- time
- status (pending/confirmed/completed/cancelled)
- notes
- price
- paymentStatus
- paymentIntentId
- timestamps

### Reviews Collection
- _id
- serviceId (ref)
- userId (ref)
- clientName
- rating (1-5)
- comment
- verified
- timestamps

## أدوات Postman

يمكنك استيراد هذا الـ URL للحصول على مجموعة Postman كاملة:
```
[سيتم إضافة الرابط لاحقاً]
```

## تصحيح الأخطاء

### خطأ: "MongoDB connection failed"
```bash
# تحقق من أن MongoDB يعمل
# على ماك:
brew services list

# ابدأ MongoDB:
brew services start mongodb-community
```

### خطأ: "STRIPE_SECRET_KEY is not defined"
```bash
# أضف المفتاح في .env
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### خطأ: "Port 5000 is already in use"
```bash
# ابحث عن العملية واوقفها
# على ماك/لينكس:
lsof -ti:5000 | xargs kill -9
```

## الأمان

- ✅ تشفير كلمات المرور بـ bcryptjs
- ✅ مصادقة JWT آمنة
- ✅ CORS مُعدّ
- ✅ Helmet للرؤوس الآمنة
- ✅ التحقق من صلاحيات المسؤول

## مستويات الوصول

### Public (بلا مصادقة)
- `GET /api/services`
- `GET /api/services/:id`
- `GET /api/services/search`
- `GET /api/reviews/service/:serviceId`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected (مصادقة مطلوبة)
- جميع عمليات المستخدم
- حجز المواعيد
- الدفع
- التقييمات

### Admin Only (أدمن فقط)
- إنشاء/تعديل/حذف الخدمات
- تأكيد/إكمال المواعيد
- التحقق من التقييمات

## الخطوات القادمة

1. تطوير لوحة تحكم Admin
2. إضافة إشعارات البريد الإلكتروني
3. نظام الفواتير
4. تقارير الأداء
5. دعم اللغات المتعددة

---

**آخر تحديث**: يوليو 2026
