import { db } from './firebase';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Review } from './types';

type FirestoreReview = {
  productId: string;
  productName: string;
  name: string;
  rating: number;
  text: string;
  createdAt?: { toDate?: () => Date } | Date;
};

function toDate(value?: { toDate?: () => Date } | Date): Date {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  return new Date(0);
}

function mapReview(id: string, data: FirestoreReview): Review {
  return {
    id,
    productId: data.productId,
    productName: data.productName,
    name: data.name,
    rating: data.rating,
    text: data.text,
    createdAt: toDate(data.createdAt),
  };
}

export async function submitReview(input: {
  productId: string;
  productName: string;
  name: string;
  rating: number;
  text: string;
}): Promise<string> {
  const name = input.name.trim();
  const text = input.text.trim();

  if (!name) throw new Error('Name is required');
  if (!text) throw new Error('Review text is required');
  if (input.rating < 1 || input.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const docRef = await addDoc(collection(db, 'reviews'), {
    productId: input.productId,
    productName: input.productName,
    name,
    rating: input.rating,
    text,
    createdAt: new Date(),
  });

  return docRef.id;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const reviewsQuery = query(collection(db, 'reviews'), where('productId', '==', productId));
  const snapshot = await getDocs(reviewsQuery);

  return snapshot.docs
    .map((reviewDoc) => mapReview(reviewDoc.id, reviewDoc.data() as FirestoreReview))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getLatestReviews(limitCount = 10): Promise<Review[]> {
  const snapshot = await getDocs(collection(db, 'reviews'));

  return snapshot.docs
    .map((reviewDoc) => mapReview(reviewDoc.id, reviewDoc.data() as FirestoreReview))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limitCount);
}
