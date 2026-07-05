import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  date: string;
  time: string;
  note?: string;
  total: string;
  paymentMethod?: string;
  status: OrderStatus;
  rating?: number;
  review?: string;
  createdAt: string;
}

export class OrderService {
  /**
   * Create a new order in Firebase
   */
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean, orderId?: string, error?: string }> {
    try {
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
      
      const newOrder = {
        ...orderData,
        id: orderId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "orders", orderId), newOrder);
      
      return { success: true, orderId };
    } catch (error: any) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get an order by ID
   */
  static async getOrderById(orderId: string): Promise<{ success: boolean, data?: Order, error?: string }> {
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId));
      if (orderDoc.exists()) {
        return { success: true, data: orderDoc.data() as Order };
      }
      return { success: false, error: "Order not found" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all orders for a specific customer
   */
  static async getCustomerOrders(customerId: string): Promise<{ success: boolean, data: Order[], error?: string }> {
    try {
      const q = query(
        collection(db, "orders"),
        where("customerId", "==", customerId)
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as Order);
      });
      
      // Sort by createdAt descending (client-side sorting to avoid requiring composite indexes initially)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { success: true, data: orders };
    } catch (error: any) {
      console.error("Error fetching customer orders:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get all orders for a specific vendor
   */
  static async getVendorOrders(vendorId: string): Promise<{ success: boolean, data: Order[], error?: string }> {
    try {
      const q = query(
        collection(db, "orders"),
        where("vendorId", "==", vendorId)
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as Order);
      });
      
      // Sort by createdAt descending
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { success: true, data: orders };
    } catch (error: any) {
      console.error("Error fetching vendor orders:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get ALL orders (admin only)
   */
  static async getAllOrders(): Promise<{ success: boolean, data: Order[], error?: string }> {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders: Order[] = [];
      querySnapshot.forEach(docSnap => {
        orders.push(docSnap.data() as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return { success: true, data: orders };
    } catch (error: any) {
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean, error?: string }> {
    try {
      const { updateDoc, getDoc } = await import("firebase/firestore");
      
      await updateDoc(doc(db, "orders", orderId), { status });
      
      // If completed, increment vendor ordersCount
      if (status === 'completed') {
        const orderSnap = await getDoc(doc(db, "orders", orderId));
        if (orderSnap.exists()) {
          const vendorId = orderSnap.data().vendorId;
          const vendorRef = doc(db, "users", vendorId);
          const vendorSnap = await getDoc(vendorRef);
          
          if (vendorSnap.exists()) {
            const currentOrdersCount = vendorSnap.data().ordersCount || 0;
            await updateDoc(vendorRef, { ordersCount: currentOrdersCount + 1 });
          }
        }
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Add rating to order
   */
  static async addRatingToOrder(orderId: string, rating: number, review: string): Promise<{ success: boolean, error?: string }> {
    try {
      const { updateDoc, getDoc } = await import("firebase/firestore");
      
      await updateDoc(doc(db, "orders", orderId), { rating, review });
      
      // Update vendor rating average
      const orderSnap = await getDoc(doc(db, "orders", orderId));
      if (orderSnap.exists()) {
        const vendorId = orderSnap.data().vendorId;
        const vendorRef = doc(db, "users", vendorId);
        const vendorSnap = await getDoc(vendorRef);
        
        if (vendorSnap.exists()) {
          const vData = vendorSnap.data();
          const currentReviewsCount = vData.reviewsCount || 0;
          const currentRating = vData.rating || 0;
          
          const newReviewsCount = currentReviewsCount + 1;
          const newRating = ((currentRating * currentReviewsCount) + rating) / newReviewsCount;
          
          // Round to 1 decimal place
          const roundedRating = Math.round(newRating * 10) / 10;
          
          await updateDoc(vendorRef, { 
            rating: roundedRating, 
            reviewsCount: newReviewsCount 
          });
        }
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
