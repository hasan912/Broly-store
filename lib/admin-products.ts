import { auth, db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { Product } from './types';
import { waitForAuthUser } from './auth';

const CATEGORIES_COLLECTION = 'categories';

function normalizeCategoryName(name: string): string {
  return name.trim();
}

function toCategoryKey(name: string): string {
  return normalizeCategoryName(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uploadImageToSupabase(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Failed to upload image.';
    try {
      const payload = await response.json();
      if (typeof payload?.error === 'string' && payload.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Keep default message when response isn't JSON.
    }

    throw new Error(errorMessage);
  }

  const payload = await response.json();
  if (typeof payload?.url !== 'string' || !payload.url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return payload.url;
}

async function normalizeImages(
  imageInputs: Array<File | string> | undefined,
  fallbackImage = ''
): Promise<string[]> {
  if (!imageInputs || imageInputs.length === 0) {
    return fallbackImage ? [fallbackImage] : [];
  }

  const normalized = await Promise.all(
    imageInputs.map(async (imageInput) => {
      if (typeof imageInput === 'string') return imageInput;

      return uploadImageToSupabase(imageInput);
    })
  );

  return normalized.filter((image) => Boolean(image)).slice(0, 4);
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  imageInputs?: Array<File | string>
) {
  try {
    const images = await normalizeImages(imageInputs, data.image);
    const primaryImage = images[0] || data.image;

    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      image: primaryImage,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>,
  imageInputs?: Array<File | string>
) {
  try {
    const images = await normalizeImages(imageInputs, data.image || '');
    const primaryImage = images[0] || data.image;

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (primaryImage) {
      updateData.image = primaryImage;
    }

    if (images.length > 0) {
      updateData.images = images;
    }

    await updateDoc(doc(db, 'products', id), updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    // Validate server session first
    const sessionResponse = await fetch('/api/admin/login?action=delete-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      const error = new Error(errorData.error || 'Failed to delete product') as Error & {
        code?: string;
      };
      error.code = errorData.code || 'delete-failed';
      throw error;
    }

    // Get or wait for Firebase user
    let user = auth.currentUser;
    if (!user) {
      user = await waitForAuthUser(3000);
    }

    if (!user) {
      // No Firebase user authenticated - try to login with default admin credentials
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        
        // Use hardcoded fallback credentials (from env.local example)
        // In production, these should be from environment
        const adminEmail = 'admin@brolystore.com';
        const adminPassword = 'brolystore@2026';
        
        console.log('Attempting Firebase login with default credentials...');
        try {
          const credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
          user = credential.user;
          console.log('✅ Firebase login successful');
        } catch (loginError: any) {
          console.error('Firebase login failed:', loginError?.code);
          
          throw new Error(
            `Firebase user not found or credentials incorrect.\n\n` +
            `To fix this:\n` +
            `1. Open Firebase Console (console.firebase.google.com)\n` +
            `2. Go to Authentication → Users\n` +
            `3. Create a new user with:\n` +
            `   - Email: admin@brolystore.com\n` +
            `   - Password: brolystore@2026\n` +
            `4. Make sure Email/Password auth is enabled\n` +
            `5. Restart the app and try again`
          );
        }
      } catch (setupError: any) {
        const error = new Error(setupError?.message || 'Firebase setup required') as Error & {
          code?: string;
        };
        error.code = 'firebase-setup-required';
        throw error;
      }
    }

    // Get fresh auth token for this user
    if (user) {
      await user.getIdToken(true);
      console.log('✅ Got fresh Firebase auth token');
    }

    // Delete the product from Firestore
    console.log('🗑️ Deleting product:', id);
    await deleteDoc(doc(db, 'products', id));
    console.log('✅ Product deleted successfully');
    
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));

    const categoriesMap = new Map<string, string>();
    const addCategory = (value?: string) => {
      const normalized = normalizeCategoryName(value || '');
      if (!normalized) return;

      const key = normalized.toLowerCase();
      if (!categoriesMap.has(key)) {
        categoriesMap.set(key, normalized);
      }
    };

    try {
      const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      categoriesSnapshot.forEach((categoryDoc) => {
        const data = categoryDoc.data() as { name?: string };
        addCategory(data.name);
      });
    } catch (categoryError: any) {
      // If categories collection is unavailable, still show categories inferred from products.
      const code = categoryError?.code;
      if (code !== 'permission-denied' && code !== 'missing-or-insufficient-permissions') {
        console.warn('Unable to read categories collection, falling back to product categories only.', categoryError);
      }
    }

    productsSnapshot.forEach((productDoc) => {
      const product = productDoc.data() as Product;
      addCategory(product.category);
    });

    return Array.from(categoriesMap.values()).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string): Promise<string> {
  const normalized = normalizeCategoryName(name);
  if (!normalized) {
    throw new Error('Category name is required');
  }

  const existingCategories = await getCategories();
  const exists = existingCategories.some(
    (category) => category.toLowerCase() === normalized.toLowerCase()
  );

  if (exists) {
    throw new Error('This category already exists');
  }

  const categoryId = toCategoryKey(normalized) || normalized.toLowerCase();
  await setDoc(doc(db, CATEGORIES_COLLECTION, categoryId), {
    name: normalized,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return normalized;
}

export async function deleteCategory(name: string): Promise<void> {
  const normalized = normalizeCategoryName(name);
  if (!normalized) {
    throw new Error('Category name is required');
  }

  const productsSnapshot = await getDocs(collection(db, 'products'));
  const inUse = productsSnapshot.docs.some((productDoc) => {
    const product = productDoc.data() as Product;
    return normalizeCategoryName(product.category).toLowerCase() === normalized.toLowerCase();
  });

  if (inUse) {
    throw new Error('Cannot delete category because it is assigned to one or more products');
  }

  const categoryKey = toCategoryKey(normalized);
  if (categoryKey) {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryKey));
    return;
  }

  throw new Error('Unable to delete category');
}
