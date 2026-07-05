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
  totalRevenue: "Rp 8.500.000",
  activeBookings: 12,
  completedBookings: 45,
  totalServices: 5
};

const MOCK_VENDOR_BOOKINGS: VendorBookingItem[] = [
  {
    id: "BK-1001",
    customerName: "Amanda Putri",
    serviceName: "Makeup Wisuda",
    date: "2026-08-10",
    time: "08:00",
    status: "pending",
    price: "Rp 350.000"
  },
  {
    id: "BK-1002",
    customerName: "Sarah M.",
    serviceName: "Makeup Wedding",
    date: "2026-08-15",
    time: "06:00",
    status: "confirmed",
    price: "Rp 1.500.000"
  },
  {
    id: "BK-1003",
    customerName: "Budi Santoso",
    serviceName: "Sewa Kostum Spiderman",
    date: "2026-08-12",
    time: "10:00",
    status: "completed",
    price: "Rp 150.000"
  }
];

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
