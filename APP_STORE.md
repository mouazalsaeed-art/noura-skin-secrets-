# 📱 نشر تطبيق Noura Skin Secrets على App Store

## ✅ ما هو جاهز الآن (تم إعداده)

- أيقونة التطبيق بشعار Noura Skin Secrets (`assets/icon.png`)
- شاشة البداية (Splash Screen) بألوان العلامة التجارية
- إعدادات iOS كاملة (`app.json`): معرّف التطبيق `com.nouraskin.app`
- إعدادات البناء السحابي (`eas.json`) — البناء يتم في السحابة، **لا تحتاج جهاز Mac**
- التطبيق يعمل بالكامل مع بيانات تجريبية مدمجة

## 🍎 الخطوات المطلوبة منك (لا يمكن لأحد عملها بدلك)

### الخطوة 1: حساب Apple Developer (مرة واحدة)
1. اذهب إلى: **https://developer.apple.com/programs/enroll/**
2. سجّل الدخول بحساب Apple ID الخاص بك (أو أنشئ واحداً)
3. اختر التسجيل كـ **فرد (Individual)**
4. ادفع رسوم الاشتراك: **99 دولار سنوياً**
5. انتظر الموافقة (عادة 24-48 ساعة)

### الخطوة 2: حساب Expo (مجاني)
1. اذهب إلى: **https://expo.dev/signup**
2. أنشئ حساباً مجانياً بإيميلك

### الخطوة 3: البناء والرفع (أوامر جاهزة)
افتح PowerShell في مجلد المشروع ونفّذ:

```bash
npm install -g eas-cli
eas login                        # سجل دخول بحساب Expo
eas build --platform ios         # بناء التطبيق في السحابة (سيطلب حساب Apple)
eas submit --platform ios        # رفع التطبيق إلى App Store
```

> 💡 أثناء `eas build` سيسألك عن حساب Apple Developer — أدخل بياناتك
> وسيتولى هو إنشاء الشهادات تلقائياً.

### الخطوة 4: إكمال بيانات المتجر
1. اذهب إلى: **https://appstoreconnect.apple.com**
2. افتح تطبيقك وأكمل: الوصف، لقطات الشاشة، سياسة الخصوصية
3. اضغط **Submit for Review**
4. مراجعة Apple تأخذ عادة 1-3 أيام

## 📲 البديل الفوري (متاح الآن مجاناً!)

التطبيق يعمل الآن كتطبيق ويب قابل للتثبيت (PWA):

**على الآيفون:**
1. افتح **https://nouraskinsecrets.se/app/** في متصفح Safari
2. اضغط زر المشاركة (المربع مع السهم ⬆️)
3. اختر **"إضافة إلى الشاشة الرئيسية"** (Add to Home Screen)
4. سيظهر التطبيق بشعار Noura على شاشتك مثل أي تطبيق!

**على الأندرويد:**
1. افتح الرابط في Chrome
2. اضغط القائمة (⋮) ثم **"إضافة إلى الشاشة الرئيسية"**

## 🤖 Google Play (اختياري)

نفس الخطوات لكن حساب Google Play Developer يكلف **25 دولار مرة واحدة فقط**:
1. https://play.google.com/console/signup
2. ثم: `eas build --platform android` و `eas submit --platform android`
