# 🚀 نشر النظام على الإنترنت

تعليمات نشر Noura Skin Secrets على الخدمات السحابية المجانية

## 📋 المتطلبات:

- ✅ حساب GitHub
- ✅ حساب Vercel (مجاني)
- ✅ حساب Heroku (مجاني)
- ✅ حساب MongoDB Atlas (مجاني)

---

## 🔧 الخطوة 1: إعداد قاعدة البيانات (MongoDB Atlas)

### 1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register

### 2. أنشئ Cluster:
- اختر: **M0 Sandbox** (مجاني)
- اختر الإقليم الأقرب: **Middle East** أو **Europe**

### 3. أنشئ مستخدم قاعدة البيانات:
- اسم المستخدم: `admin`
- كلمة المرور: اختر كلمة قوية

### 4. احصل على Connection String:
- اضغط: **Connect**
- اختر: **Connect your application**
- انسخ الـ Connection String
- استبدل `<password>` بكلمة المرور الفعلية

### 5. ستحصل على رابط مثل:
```
mongodb+srv://admin:PASSWORD@cluster.mongodb.net/noura-skin-secrets?retryWrites=true&w=majority
```

**احفظ هذا الرابط!**

---

## 📤 الخطوة 2: رفع المشروع على GitHub

### 1. اذهب إلى: https://github.com/new

### 2. أنشئ Repository:
- اسم: `noura-skin-secrets`
- اختر: **Public**
- اضغط: **Create repository**

### 3. شغّل الأوامر في Terminal:

```bash
cd noura-skin-secrets-
git remote set-url origin https://github.com/YOUR_USERNAME/noura-skin-secrets.git
git add -A
git commit -m "Initial commit - Full stack app ready for deployment"
git push -u origin main
```

استبدل `YOUR_USERNAME` باسمك على GitHub

---

## 🟢 الخطوة 3: نشر الخادم على Heroku

### 1. اذهب إلى: https://heroku.com

### 2. اضغط: **New** → **Create new app**

### 3. اسم التطبيق:
```
noura-skin-secrets-api
```

### 4. اختر المنطقة: **Europe**

### 5. اضغط: **Create app**

### 6. اختر: **Connect to GitHub**

### 7. ابحث عن: `noura-skin-secrets` واضغط **Connect**

### 8. أضف متغيرات البيئة:
- اذهب إلى: **Settings**
- اضغط: **Reveal Config Vars**
- أضف:

```
MONGODB_URI = mongodb+srv://admin:PASSWORD@cluster...
JWT_SECRET = your_secret_key_here_12345
NODE_ENV = production
```

### 9. اضغط: **Deploy branch**

### 10. احصل على الرابط:
- الخادم سيكون على: `https://noura-skin-secrets-api.herokuapp.com`

**احفظ هذا الرابط!**

---

## 🔵 الخطوة 4: نشر لوحة التحكم على Vercel

### 1. اذهب إلى: https://vercel.com/new

### 2. اختر: **Import a Project**

### 3. ابحث عن: `noura-skin-secrets` واختره

### 4. اختر: **Monorepo Setup**
- Root Directory: `./`
- اضغط: **Configure**

### 5. اختر مجلد `admin`

### 6. أضف متغيرات البيئة:
```
VITE_API_URL = https://noura-skin-secrets-api.herokuapp.com
```

### 7. اضغط: **Deploy**

### 8. احصل على الرابط:
- لوحة التحكم ستكون على: `https://noura-skin-secrets.vercel.app`

---

## ✅ النتيجة النهائية:

| التطبيق | الرابط |
|--------|--------|
| **لوحة التحكم** | https://noura-skin-secrets.vercel.app |
| **الخادم API** | https://noura-skin-secrets-api.herokuapp.com |

---

## 🔑 بيانات الدخول:

```
البريد: admin@nouraskin.com
كلمة المرور: ChangeMe123!
```

---

## 🆘 استكشاف الأخطاء:

### خطأ: "Cannot find module"
```bash
npm install
git add -A
git commit -m "Install dependencies"
git push
```

### خطأ: "MongoDB connection failed"
- تحقق من Connection String في Heroku Config Vars
- تأكد من أن كلمة المرور صحيحة

### خطأ: "CORS error"
- في `server/src/server.ts`
- عدّل CORS ليشمل رابط Vercel:
```typescript
cors({
  origin: ['https://noura-skin-secrets.vercel.app', 'http://localhost:3000'],
})
```

---

## 📝 ملاحظات:

1. **MongoDB مجاني** لـ 512 MB
2. **Heroku مجاني** مع حد معين
3. **Vercel مجاني** بلا حدود
4. غيّر `JWT_SECRET` في الإنتاج!
5. لا تحفظ `.env` في Git

---

## 🎉 بعد الإنشاء:

جرّب الروابط:
- https://noura-skin-secrets.vercel.app
- https://noura-skin-secrets-api.herokuapp.com/api/health

يجب تشوف:
```json
{"message":"Server is running"}
```

---

**تم! النظام جاهز على الإنترنت!** 🚀
