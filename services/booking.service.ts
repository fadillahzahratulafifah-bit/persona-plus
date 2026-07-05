// Mock service for Phase 3

export interface BookingHistoryItem {
  id: string;
  vendorName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "waiting_payment" | "confirmed" | "completed" | "cancelled";
  total: string;
  createdAt: string;
}

// Dummy data for user history
const MOCK_HISTORY: BookingHistoryItem[] = [
  {
    id: "BK-1001",
    vendorName: "KL Makeup Studio",
    serviceName: "Makeup Wisuda",
    date: "2026-08-10",
    time: "08:00",
    status: "confirmed",
    total: "Rp 350.000",
    createdAt: "2026-07-01",
  },
  {
    id: "BK-1002",
    vendorName: "Disney Dreams",
    serviceName: "Disney Princess Makeup",
    date: "2026-07-20",
    time: "10:00",
    status: "completed",
    total: "Rp 500.000",
    createdAt: "2026-06-15",
  }
];

export class BookingService {
  static async getAvailableSlots(vendorId: string, date: string): Promise<{ success: boolean; data: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate available slots
    return { success: true, data: ["08:00", "09:00", "11:00", "14:00", "16:00"] };
  }

  static async validateVoucher(code: string): Promise<{ success: boolean; discount?: number; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (code.toUpperCase() === "PERSONA20") {
      return { success: true, discount: 20000 };
    }
    return { success: false, error: "Voucher tidak valid atau sudah kadaluarsa" };
  }

  static async createBooking(data: any): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate booking creation
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // In a real app we would save to Firestore here.
    return { success: true, bookingId: newId };
  }

  static async getBookingHistory(): Promise<{ success: boolean; data: BookingHistoryItem[] }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, data: MOCK_HISTORY };
  }
}
