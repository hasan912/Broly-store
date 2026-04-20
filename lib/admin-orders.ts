import { auth, db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Order } from './types';
import { waitForAuthUser } from './auth';

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<Order, 'id'>),
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const user = auth.currentUser ?? (await waitForAuthUser());

    if (!user) {
      const error = new Error('Admin auth session missing. Please login again.') as Error & {
        code?: string;
      };
      error.code = 'admin-auth-missing';
      throw error;
    }

    await user.getIdToken(true);
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

export async function getOrderStats() {
  try {
    const orders = await getOrders();

    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    };

    return stats;
  } catch (error) {
    console.error('Error calculating order stats:', error);
    throw error;
  }
}
