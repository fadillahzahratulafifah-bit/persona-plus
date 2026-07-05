import { create } from 'zustand';

export interface BookingStateData {
  vendorId: string | null;
  serviceId: string | null;
  serviceName: string | null;
  price: string | null;
  date: string | null;
  time: string | null;
  note: string;
  voucherCode: string | null;
  discount: number;
}

interface BookingStore {
  bookingData: BookingStateData;
  setVendor: (id: string) => void;
  setService: (id: string, name: string, price: string) => void;
  setSchedule: (date: string, time: string) => void;
  setNote: (note: string) => void;
  applyVoucher: (code: string, discount: number) => void;
  resetBooking: () => void;
}

const initialState: BookingStateData = {
  vendorId: null,
  serviceId: null,
  serviceName: null,
  price: null,
  date: null,
  time: null,
  note: "",
  voucherCode: null,
  discount: 0,
};

export const useBookingStore = create<BookingStore>((set) => ({
  bookingData: initialState,
  setVendor: (id) => set((state) => ({ bookingData: { ...state.bookingData, vendorId: id } })),
  setService: (id, name, price) => set((state) => ({ bookingData: { ...state.bookingData, serviceId: id, serviceName: name, price } })),
  setSchedule: (date, time) => set((state) => ({ bookingData: { ...state.bookingData, date, time } })),
  setNote: (note) => set((state) => ({ bookingData: { ...state.bookingData, note } })),
  applyVoucher: (code, discount) => set((state) => ({ bookingData: { ...state.bookingData, voucherCode: code, discount } })),
  resetBooking: () => set({ bookingData: initialState }),
}));
