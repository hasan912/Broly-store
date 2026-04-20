# Product Delete - Firebase Setup (Simple Fix)

## مسئلہ
Product delete نہیں ہو رہا۔

## حل (یہ کریں):

### Step 1: Firebase Console میں جائیں
```
https://console.firebase.google.com
```

### Step 2: اپنا Project select کریں
- broly-f1eca project کھولیں

### Step 3: Authentication Setup
1. Left menu میں **Authentication** پر کلک کریں
2. **Sign-in method** tab میں جائیں
3. اگر **Email/Password** disabled ہے تو enable کریں

### Step 4: User بنائیں
1. **Users** tab میں جائیں
2. **Add user** بٹن پر کلک کریں
3. یہ داخل کریں:
   - **Email**: `admin@brolystore.com` (یا کوئی بھی)
   - **Password**: `brolystore@2026` (یا کوئی بھی - .env.local سے match کریں)
4. **Create user** کلک کریں

### Step 5: App میں Test کریں
1. App کو refresh کریں
2. Admin login کریں اپنے credentials سے
3. Product delete کریں - یہ اب کام کرے گا! ✅

## اگر ابھی نہیں کاموں کریں

### Debug کریں:
1. Browser کھولیں → F12 (DevTools)
2. Console tab میں جائیں
3. Admin page پر جائیں
4. Product delete کریں
5. Error message دیکھیں

### عام مسائل:

| مسئلہ | حل |
|------|-----|
| "invalid-credential" | Firebase user موجود نہیں → Step 4 کریں |
| "permission-denied" | Email/Password auth disabled → Step 3 کریں |
| "session missing" | Login دوبارہ کریں |

## اہم نکات:
- Email کوئی بھی ہو سکتا ہے، PASSWORD .env.local سے match ہونا چاہیے
- App restart کریں تبدیلیوں کے بعد
- Browser cache صاف کریں اگر مسئلہ برقرار ہو

