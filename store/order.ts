import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  date: string;
  time: string;
  total: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getCustomerOrders: (customerId: string) => Order[];
  getVendorOrders: (vendorId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (orderData) => {
        const id = `ORD-${Math.floor(Math.random() * 10000)}`;
        const newOrder: Order = {
          ...orderData,
          id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        return id;
      },
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, status } : order
          )
        }));
      },
      getCustomerOrders: (customerId) => {
        // In this dummy app, we just return all orders to simulate customer seeing their orders
        // If we want exact matching: return get().orders.filter(o => o.customerId === customerId);
        return get().orders; 
      },
      getVendorOrders: (vendorId) => {
        // In this dummy app, we just return all orders to simulate vendor seeing their incoming orders
        return get().orders;
      }
    }),
    {
      name: 'persona-orders-storage', // name of the item in the storage (must be unique)
    }
  )
);
