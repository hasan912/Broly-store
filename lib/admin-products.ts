import { db } from './firebase';
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

// Convert File to base64 string
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
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
      return fileToBase64(imageInput);
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
    await deleteDoc(doc(db, 'products', id));
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
    } catch (categoryError) {
      // If categories collection is unavailable, still show categories inferred from products.
      console.warn('Unable to read categories collection, falling back to product categories only.', categoryError);
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
