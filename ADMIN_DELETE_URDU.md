# Product Delete کرنے میں مسئلہ - حل

## مسئلہ کیا تھا؟
جب آپ product کو delete کرنے کی کوشش کرتے تھے تو یہ error آتا تھا:
```
"Admin auth session missing. Please login again."
```

## وجہ کیا تھی؟
1. ✅ Server میں session cookie صحیح طریقے سے set ہو رہا تھا
2. ❌ لیکن Firebase auth fail ہو رہی تھی
3. Firestore کے rules کے مطابق product delete کرنے کے لیے دونوں کی ضرورت ہے

اصل مسئلہ یہ ہے کہ Firebase میں وہ admin user موجود نہیں ہے جو آپ کے `.env.local` میں define کیا گیا ہے۔

## حل - یہ کریں:

### آپشن 1: Firebase میں نیا user بنائیں (بہترین طریقہ)
1. Firebase Console کھولیں → Authentication → Users
2. "Add user" پر کلک کریں
3. یہ معلومات داخل کریں:
   - **Email**: `admin@brolystore.com` (یا آپ کا ADMIN_EMAIL)
   - **Password**: اپنا ADMIN_PASSWORD (جو `.env.local` میں ہے)
4. User کو save کریں

### آپشن 2: اپنا email/password بدلیں
اگر آپ کے پاس Firebase میں کوئی دوسرا admin user ہے:
1. `.env.local` فائل میں یہ بدلیں:
   ```
   ADMIN_EMAIL=آپ_کا_firebase_email@example.com
   ADMIN_PASSWORD=آپ_کا_firebase_password
   ```
2. یقینی بنائیں کہ یہ user Firebase میں موجود ہے

### آپشن 3: Command سے user بنائیں
```bash
firebase auth:create --email admin@brolystore.com --password brolystore@2026
```

## اب کیا کریں?

1. اپنے admin credentials سے login کریں
2. کوئی product delete کرنے کی کوشش کریں
3. اگر اب بھی error ہے تو:
   - Browser console میں error دیکھیں
   - اگر "invalid-credential" ہے → user Firebase میں نہیں ہے
   - اگر "permission-denied" ہے → admin email غلط ہے

## تکنیکی تفصیل

Firebase میں یہ ہو رہی ہے:
- اگر Firebase user match نہ ہو تو `auth/invalid-credential` error
- اگر user match ہو لیکن email غلط ہو تو `permission-denied` error
- اگر دونوں ٹھیک ہوں تو product delete ہو جائے گی

## اگر ابھی بھی مسئلہ ہے:

پروجیکٹ کے root میں `ADMIN_DELETE_FIX.md` فائل ہے جو تفصیل سے بتاتی ہے۔

اہم نکات:
- Firebase Console میں Email/Password authentication enabled ہونی چاہیے
- Admin email Firebase میں موجود ہونی چاہیے
- Password match ہونا چاہیے
