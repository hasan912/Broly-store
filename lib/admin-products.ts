import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Product } from './types';

// Convert File to base64 string
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  imageFile?: File
) {
  try {
    let imageUrl = data.image;

    // Convert image to base64 if provided
    if (imageFile) {
      imageUrl = await fileToBase64(imageFile);
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      image: imageUrl,
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
  imageFile?: File
) {
  try {
    let imageUrl = data.image;

    // Convert image to base64 if provided
    if (imageFile) {
      imageUrl = await fileToBase64(imageFile);
    }

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (imageUrl) {
      updateData.image = imageUrl;
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
