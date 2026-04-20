// Paste this in Browser Console while on Admin Page to diagnose delete issues

console.log('🔍 Checking Admin Delete Setup...\n');

// Check 1: Session Cookie
console.log('1️⃣ Checking Admin Session Cookie:');
const sessionCookie = document.cookie.split('; ').find(c => c.startsWith('broly_admin_session='));
if (sessionCookie) {
  console.log('✅ Session cookie exists:', sessionCookie);
} else {
  console.log('❌ Session cookie NOT found - You may need to login again');
}

// Check 2: Firebase Auth
console.log('\n2️⃣ Checking Firebase Authentication:');
if (typeof window !== 'undefined' && window.firebase) {
  const auth = window.firebase?.auth?.();
  if (auth?.currentUser) {
    console.log('✅ Firebase user logged in:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
    });
  } else {
    console.log('❌ Firebase user NOT logged in');
    console.log('   This might be why delete is failing');
  }
} else {
  console.log('⚠️  Firebase not loaded yet');
}

// Check 3: Environment Config
console.log('\n3️⃣ Checking Firebase Config:');
if (typeof window !== 'undefined' && window.firebase?.app?.()) {
  const app = window.firebase.app();
  const config = app.options;
  console.log('✅ Firebase Project ID:', config.projectId);
} else {
  console.log('❌ Firebase app not initialized');
}

console.log('\n📝 Instructions:');
console.log('If "Firebase user NOT logged in" above:');
console.log('1. Make sure Email/Password auth is enabled in Firebase Console');
console.log('2. Create a Firebase user with email: admin@brolystore.com');
console.log('3. Password should match your ADMIN_PASSWORD in .env.local');
console.log('4. Restart the app');
console.log('5. Login again and try deleting');

console.log('\n💡 Tip: Check DevTools Network tab when clicking delete to see API calls');
