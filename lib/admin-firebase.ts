import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

function initializeAdmin() {
  if (adminApp) {
    return adminApp;
  }

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
  );

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'broly-f1eca',
  });

  return adminApp;
}

function getAdminApp() {
  return initializeAdmin();
}

export const adminDb = getAdminApp().firestore();
export const adminAuth = getAdminApp().auth();
