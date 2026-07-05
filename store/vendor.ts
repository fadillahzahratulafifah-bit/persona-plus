import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VendorServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
}

interface VendorState {
  services: VendorServiceItem[];
  addService: (service: Omit<VendorServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      services: [],
      addService: (service) => {
        const newService: VendorServiceItem = {
          ...service,
          id: `svc-${Date.now()}`
        };
        set((state) => ({
          services: [newService, ...state.services]
        }));
      },
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter(s => s.id !== id)
        }));
      }
    }),
    {
      name: 'persona-vendor-services-storage',
    }
  )
);
