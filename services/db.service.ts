import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";

export interface VendorServiceItem {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: 'makeup' | 'costume';
  anime?: string;
  character?: string;
  size?: string;
  createdAt: string;
}

export class DbService {
  /**
   * Get all vendors (users with role === 'vendor')
   */
  static async getVendors(): Promise<{ success: boolean; data: any[]; error?: string }> {
    try {
      const q = query(collection(db, "users"), where("role", "==", "vendor"));
      const querySnapshot = await getDocs(q);
      const vendors: any[] = [];
      querySnapshot.forEach((doc) => {
        vendors.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: vendors };
    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get a vendor by ID
   */
  static async getVendorById(vendorId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const docRef = await getDoc(doc(db, "users", vendorId));
      if (docRef.exists()) {
        return { success: true, data: { id: docRef.id, ...docRef.data() } };
      }
      return { success: false, error: "Vendor not found" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update Vendor Profile
   */
  static async updateVendorProfile(vendorId: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      await updateDoc(doc(db, "users", vendorId), data);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new service / costume
   */
  static async addService(data: Omit<VendorServiceItem, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const id = `svc-${Date.now()}`;
      await setDoc(doc(db, "services", id), {
        ...data,
        id,
        createdAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error: any) {
      console.error("Error adding service:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get services by Vendor ID
   */
  static async getVendorServices(vendorId: string): Promise<{ success: boolean; data: VendorServiceItem[]; error?: string }> {
    try {
      const q = query(collection(db, "services"), where("vendorId", "==", vendorId));
      const querySnapshot = await getDocs(q);
      const services: VendorServiceItem[] = [];
      querySnapshot.forEach((doc) => {
        services.push(doc.data() as VendorServiceItem);
      });
      
      // Sort by createdAt descending
      services.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { success: true, data: services };
    } catch (error: any) {
      console.error("Error fetching vendor services:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get all services by category
   */
  static async getServicesByCategory(category: 'makeup' | 'costume'): Promise<{ success: boolean; data: VendorServiceItem[]; error?: string }> {
    try {
      const q = query(collection(db, "services"), where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const services: VendorServiceItem[] = [];
      querySnapshot.forEach((doc) => {
        services.push(doc.data() as VendorServiceItem);
      });
      return { success: true, data: services };
    } catch (error: any) {
      console.error("Error fetching services:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get a service/costume by ID
   */
  static async getServiceById(serviceId: string): Promise<{ success: boolean; data?: VendorServiceItem; error?: string }> {
    try {
      const docRef = await getDoc(doc(db, "services", serviceId));
      if (docRef.exists()) {
        return { success: true, data: docRef.data() as VendorServiceItem };
      }
      return { success: false, error: "Service not found" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a service
   */
  static async deleteService(serviceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await deleteDoc(doc(db, "services", serviceId));
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting service:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get ALL users (for admin panel)
   */
  static async getAllUsers(): Promise<{ success: boolean; data: any[]; error?: string }> {
    try {
      const { getDocs: gd, collection: col } = await import("firebase/firestore");
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: any[] = [];
      querySnapshot.forEach(docSnap => {
        users.push({ id: docSnap.id, ...docSnap.data() });
      });
      users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      return { success: true, data: users };
    } catch (error: any) {
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Update an existing service/costume
   */
  static async updateService(serviceId: string, data: Partial<VendorServiceItem>): Promise<{ success: boolean; error?: string }> {
    try {
      await updateDoc(doc(db, "services", serviceId), data);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating service:", error);
      return { success: false, error: error.message };
    }
  }
}
