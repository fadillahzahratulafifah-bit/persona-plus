"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { DbService } from "@/services/db.service";
import { OrderService } from "@/services/order.service";
import { ChatService, ChatRoom, ChatMessage } from "@/services/chat.service";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Users, ShoppingBag, Store, Shield, Ban, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  const user = useAuthStore(state => state.user);
  const loadingAuth = useAuthStore(state => state.loadingAuth);
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"accounts" | "orders" | "support">("accounts");
  // Support chat state
  const [supportRooms, setSupportRooms] = useState<ChatRoom[]>([]);
  const [activeSupportRoom, setActiveSupportRoom] = useState<ChatRoom | null>(null);
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([]);
  const [replyMsg, setReplyMsg] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const supportEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== 'admin') { router.push("/"); return; }

    const load = async () => {
      const [usersRes, ordersRes] = await Promise.all([
        DbService.getAllUsers(),
        OrderService.getAllOrders?.() || { success: false, data: [] },
      ]);
      if (usersRes.success) setAccounts(usersRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      setLoading(false);
    };
    load();
  }, [user, loadingAuth, router]);

  const handleSuspend = async (userId: string, suspended: boolean) => {
    await updateDoc(doc(db, "users", userId), { suspended: !suspended });
    setAccounts(prev => prev.map(a => a.id === userId ? { ...a, suspended: !suspended } : a));
  };

  // Load support chats when tab switches
  useEffect(() => {
    if (tab === 'support' && user) {
      ChatService.getUserChats(user.id).then(res => {
        if (res.success) setSupportRooms(res.data);
      });
    }
  }, [tab, user]);

  // Listen to active support room
  useEffect(() => {
    if (!activeSupportRoom || !user) return;
    ChatService.markAsRead(activeSupportRoom.id, user.id);
    const unsub = ChatService.listenToMessages(activeSupportRoom.id, msgs => setSupportMessages(msgs));
    return () => unsub();
  }, [activeSupportRoom, user]);

  const handleSendReply = async () => {
    if (!replyMsg.trim() || !activeSupportRoom || !user) return;
    setSendingReply(true);
    const recipientId = activeSupportRoom.participants.find(p => p !== user.id) || "";
    await ChatService.sendMessage(activeSupportRoom.id, user.id, user.name, replyMsg.trim(), recipientId);
    setReplyMsg("");
    setSendingReply(false);
    ChatService.getUserChats(user.id).then(res => { if (res.success) setSupportRooms(res.data); });
  };

  const stats = {
    total: accounts.length,
    vendors: accounts.filter(a => a.role === 'vendor').length,
    customers: accounts.filter(a => a.role === 'customer').length,
    orders: orders.length,
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Memuat data admin...</div>;

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Panel Super Admin</h1>
            <p className="text-muted-foreground">Monitoring dan kelola semua akun platform.</p>
          </div>
          <Link href="/" className="ml-auto">
            <Button variant="outline" className="rounded-full">← Kembali ke App</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Akun", value: stats.total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
            { label: "Vendor", value: stats.vendors, icon: Store, color: "text-success", bg: "bg-success/10" },
            { label: "Customer", value: stats.customers, icon: Users, color: "text-accent", bg: "bg-accent/10" },
            { label: "Total Pesanan", value: stats.orders, icon: ShoppingBag, color: "text-warning", bg: "bg-warning/10" },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-2xl p-5">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className={`text-3xl font-bold font-heading ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab("accounts")} className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${tab === 'accounts' ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-muted'}`}>
            Daftar Akun
          </button>
          <button onClick={() => setTab("orders")} className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${tab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-muted'}`}>
            Semua Pesanan
          </button>
          <button onClick={() => setTab("support")} className={`px-5 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${tab === 'support' ? 'bg-primary text-primary-foreground' : 'bg-card border hover:bg-muted'}`}>
            <MessageCircle className="w-4 h-4" /> Live Chat Support
          </button>
        </div>

        {/* Support Chat Tab */}
        {tab === 'support' && (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col md:min-h-[600px]" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="flex h-full flex-col md:flex-row">
              {/* Room list */}
              <div className="md:w-72 border-b md:border-b-0 md:border-r flex flex-col bg-muted/10 shrink-0 h-1/3 md:h-full">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-base">Percakapan Support</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{supportRooms.length} percakapan</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {supportRooms.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">Belum ada percakapan.</div>
                  ) : supportRooms.map(room => {
                    const userId = room.participants.find(p => p !== user!.id) || "";
                    const partnerName = room.participantNames?.[userId] || "Pengguna";
                    return (
                      <button key={room.id} onClick={() => { setActiveSupportRoom(room); setSupportMessages([]); }}
                        className={`w-full p-4 flex gap-3 items-start border-b hover:bg-muted/30 transition-colors text-left ${activeSupportRoom?.id === room.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {partnerName[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{partnerName}</p>
                          <p className="text-xs text-muted-foreground truncate">{room.lastMessage || 'Belum ada pesan'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Chat area */}
              <div className="flex-1 flex flex-col h-2/3 md:h-full">
                {activeSupportRoom ? (
                  <>
                    <div className="p-3 md:p-4 border-b bg-muted/20 flex items-center gap-3 shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <p className="font-semibold">
                        {activeSupportRoom.participantNames?.[activeSupportRoom.participants.find(p => p !== user!.id) || ""] || "Pengguna"}
                      </p>
                      <span className="text-xs text-muted-foreground ml-auto">Support Chat</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {supportMessages.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-8">Belum ada pesan.</div>
                      )}
                      {supportMessages.map(msg => {
                        const isMe = msg.senderId === user!.id;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                              {!isMe && <p className="text-xs font-bold mb-1 opacity-70">{msg.senderName}</p>}
                              {msg.imageUrl && <img src={msg.imageUrl} alt="Gambar" className="rounded-xl max-w-full mb-1" style={{ maxHeight: '150px' }} />}
                              {msg.text && <p>{msg.text}</p>}
                              <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={supportEndRef} />
                    </div>
                    <div className="p-4 border-t bg-card">
                      <div className="flex gap-2 items-center">
                        <input type="text" value={replyMsg} onChange={e => setReplyMsg(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                          placeholder="Balas sebagai Admin..."
                          className="flex-1 px-4 py-2.5 rounded-full border bg-muted focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm" />
                        <Button onClick={handleSendReply} disabled={!replyMsg.trim() || sendingReply} size="icon" className="rounded-full w-10 h-10 shrink-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="font-semibold text-muted-foreground">Pilih percakapan di kiri</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Table */}
        {tab === 'accounts' && (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left">Nama</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data akun.</td></tr>
                  ) : accounts.map(acc => (
                    <tr key={acc.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{acc.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{acc.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          acc.role === 'vendor' ? 'bg-success/10 text-success' :
                          acc.role === 'admin' ? 'bg-primary/10 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>{acc.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        {acc.suspended ? (
                          <span className="px-2.5 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold">Suspended</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-success/10 text-success rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/>Aktif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {acc.id !== user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`rounded-full text-xs ${acc.suspended ? 'text-success border-success/40 hover:bg-success/10' : 'text-destructive border-destructive/40 hover:bg-destructive hover:text-white'}`}
                            onClick={() => handleSuspend(acc.id, acc.suspended)}
                          >
                            {acc.suspended ? <><CheckCircle2 className="w-3 h-3 mr-1"/>Aktifkan</> : <><Ban className="w-3 h-3 mr-1"/>Suspend</>}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {tab === 'orders' && (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left">ID Order</th>
                    <th className="px-6 py-4 text-left">Layanan</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Vendor</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Belum ada pesanan.</td></tr>
                  ) : orders.map(o => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                      <td className="px-6 py-4 font-medium">{o.serviceName}</td>
                      <td className="px-6 py-4">{o.customerName}</td>
                      <td className="px-6 py-4">{o.vendorName}</td>
                      <td className="px-6 py-4 font-bold text-primary">{o.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          o.status === 'confirmed' ? 'bg-success/10 text-success' :
                          o.status === 'pending' ? 'bg-warning/10 text-warning' :
                          o.status === 'completed' ? 'bg-primary/10 text-primary' :
                          'bg-destructive/10 text-destructive'
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
