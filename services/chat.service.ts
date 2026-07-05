import { db } from "@/lib/firebase";
import {
  collection, doc, setDoc, getDoc, getDocs, query,
  where, orderBy, onSnapshot, updateDoc, serverTimestamp,
  addDoc, Timestamp
} from "firebase/firestore";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: { [uid: string]: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: { [uid: string]: number };
}

export class ChatService {
  /**
   * Get or create a chat room between two users
   */
  static async getOrCreateChat(
    userId1: string, userName1: string,
    userId2: string, userName2: string
  ): Promise<{ success: boolean; chatId?: string; error?: string }> {
    try {
      // Query for existing chat room with both participants
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", userId1)
      );
      const snapshot = await getDocs(q);
      
      // Find a room that includes userId2
      let existingChatId: string | null = null;
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as ChatRoom;
        if (data.participants.includes(userId2)) {
          existingChatId = docSnap.id;
        }
      });

      if (existingChatId) {
        return { success: true, chatId: existingChatId };
      }

      // Create new chat room
      const chatId = `${userId1}_${userId2}_${Date.now()}`;
      const newChat: Omit<ChatRoom, 'id'> = {
        participants: [userId1, userId2],
        participantNames: { [userId1]: userName1, [userId2]: userName2 },
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unreadCount: { [userId1]: 0, [userId2]: 0 },
      };
      await setDoc(doc(db, "chats", chatId), newChat);
      return { success: true, chatId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all chat rooms for a user
   */
  static async getUserChats(userId: string): Promise<{ success: boolean; data: ChatRoom[]; error?: string }> {
    try {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", userId)
      );
      const snapshot = await getDocs(q);
      const chats: ChatRoom[] = [];
      snapshot.forEach(docSnap => {
        chats.push({ id: docSnap.id, ...docSnap.data() } as ChatRoom);
      });
      // Sort by lastMessageAt descending
      chats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      return { success: true, data: chats };
    } catch (error: any) {
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Send a message in a chat room
   */
  static async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    text: string,
    recipientId: string,
    imageUrl?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const messageRef = collection(db, "chats", chatId, "messages");
      const newMsg: Omit<ChatMessage, 'id'> = {
        senderId,
        senderName,
        text,
        ...(imageUrl ? { imageUrl } : {}),
        createdAt: new Date().toISOString(),
        read: false,
      };
      await addDoc(messageRef, newMsg);

      // Update chat room's lastMessage and unread count
      const lastMsgPreview = imageUrl ? (text || '📷 Gambar') : text;
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: lastMsgPreview,
        lastMessageAt: new Date().toISOString(),
        [`unreadCount.${recipientId}`]: (await getDoc(doc(db, "chats", chatId))).data()?.unreadCount?.[recipientId] + 1 || 1,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Listen to messages in real-time
   */
  static listenToMessages(
    chatId: string,
    callback: (messages: ChatMessage[]) => void
  ): () => void {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, snapshot => {
      const messages: ChatMessage[] = [];
      snapshot.forEach(docSnap => {
        messages.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      callback(messages);
    });
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(chatId: string, userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`unreadCount.${userId}`]: 0,
      });
    } catch { /* silent */ }
  }
}
