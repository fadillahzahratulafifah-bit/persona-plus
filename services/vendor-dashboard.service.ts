// Mock service for Vendor Dashboard

export interface DashboardStats {
  totalRevenue: string;
  activeBookings: number;
  completedBookings: number;
  totalServices: number;
}

export interface VendorBookingItem {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: string;
}

const MOCK_STATS: DashboardStats = {
  totalRevenue: "Rp 0",
  activeBookings: 0,
  completedBookings: 0,
  totalServices: 0
};

const MOCK_VENDOR_BOOKINGS: VendorBookingItem[] = [];

export class VendorDashboardService {
  static async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: MOCK_STATS };
  }

  static async getVendorBookings(): Promise<{ success: boolean; data: VendorBookingItem[] }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, data: MOCK_VENDOR_BOOKINGS };
  }
  
  static async updateBookingStatus(bookingId: string, status: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate updating database
    return { success: true };
  }
}
