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
      services: [
        {
          id: 'svc-1',
          name: 'Makeup Wisuda Premium',
          description: 'Makeup flawless tahan 12 jam, termasuk hairdo/hijab do.',
          price: 'Rp 500.000',
        },
        {
          id: 'svc-2',
          name: 'Makeup Party Glam',
          description: 'Makeup gaya glamour cocok untuk acara malam.',
          price: 'Rp 650.000',
        }
      ],
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
