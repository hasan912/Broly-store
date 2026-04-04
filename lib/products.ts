import { db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { Product } from './types';

export async function getProducts(filters?: {
  category?: string;
  searchTerm?: string;
}): Promise<Product[]> {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    const q = constraints.length > 0 ? query(collection(db, 'products'), ...constraints) : collection(db, 'products');
    const snapshot = await getDocs(q);

    let products: Product[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Product, 'id'>),
      id: doc.id,
    }));

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docSnapshot = await getDoc(doc(db, 'products', id));
    if (docSnapshot.exists()) {
      return {
        ...(docSnapshot.data() as Omit<Product, 'id'>),
        id: docSnapshot.id,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const categories = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const category = (doc.data() as Product).category;
      if (category) {
        categories.add(category);
      }
    });
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
