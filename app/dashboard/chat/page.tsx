"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { ChatService, ChatRoom, ChatMessage } from "@/services/chat.service";
import { Send, MessageSquare, Search, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

export default function ChatPage() {
  const user = useAuthStore(state => state.user);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pendingImage, setPendingImage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCount = useRef<number>(0);

  useEffect(() => {
    if (user) {
      ChatService.getUserChats(user.id).then(res => {
        if (res.success) setRooms(res.data);
        setLoading(false);
      });
    }
  }, [user]);

  // Only auto-scroll when new messages arrive, not on typing
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (!activeRoom) return;
    ChatService.markAsRead(activeRoom.id, user!.id);
    const unsubscribe = ChatService.listenToMessages(activeRoom.id, msgs => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [activeRoom, user]);

  const handleSelectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setMessages([]);
  };

  const handleSend = async () => {
    if ((!newMsg.trim() && !pendingImage) || !activeRoom || !user) return;
    setSending(true);
    const recipientId = activeRoom.participants.find(p => p !== user.id) || "";
    await ChatService.sendMessage(activeRoom.id, user.id, user.name, newMsg.trim(), recipientId, pendingImage || undefined);
    setNewMsg("");
    setPendingImage("");
    setSending(false);
    ChatService.getUserChats(user.id).then(res => { if (res.success) setRooms(res.data); });
  };

  const getPartnerName = (room: ChatRoom) => {
    const partnerId = room.participants.find(p => p !== user?.id) || "";
    return room.participantNames?.[partnerId] || "Pengguna";
  };

  if (!user) return (
    <div className="py-20 text-center text-muted-foreground">Silakan login untuk mengakses pesan.</div>
  );

  return (
    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
      <div className="flex h-full">
        {/* Left: Room List */}
        <div className="w-80 border-r flex flex-col bg-muted/10 shrink-0">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg font-heading mb-3">Pesan</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                className="w-full pl-9 pr-4 py-2 rounded-full border bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Memuat percakapan...</div>
            ) : rooms.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada percakapan.</p>
                <p className="text-xs text-muted-foreground mt-1">Chat akan muncul setelah Anda memesan layanan.</p>
              </div>
            ) : rooms.map(room => (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`p-4 border-b cursor-pointer transition-colors flex gap-3 ${activeRoom?.id === room.id ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <div className="w-11 h-11 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base shrink-0">
                  {getPartnerName(room)[0].toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm truncate">{getPartnerName(room)}</p>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {room.lastMessageAt ? new Date(room.lastMessageAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{room.lastMessage || 'Mulai percakapan...'}</p>
                </div>
                {room.unreadCount?.[user.id] > 0 && (
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold shrink-0">
                    {room.unreadCount[user.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3 bg-card">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {getPartnerName(activeRoom)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{getPartnerName(activeRoom)}</p>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Mulai percakapan dengan mengirim pesan pertama!
                  </div>
                )}
                {messages.map(msg => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                        {msg.imageUrl && (
                          <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={msg.imageUrl} alt="Gambar" className="rounded-xl max-w-full mb-2 cursor-pointer hover:opacity-90 transition-opacity" style={{ maxHeight: '200px' }} />
                          </a>
                        )}
                        {msg.text && <p>{msg.text}</p>}
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-card space-y-2">
                {pendingImage && (
                  <div className="relative inline-block">
                    <img src={pendingImage} alt="Preview" className="h-20 rounded-xl border" />
                    <button onClick={() => setPendingImage("")} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => setPendingImage(result.info.secure_url)}>
                    {({ open }) => (
                      <Button type="button" variant="outline" size="icon" className="rounded-full w-10 h-10 shrink-0" onClick={() => open()} title="Kirim gambar">
                        <ImagePlus className="w-4 h-4" />
                      </Button>
                    )}
                  </CldUploadWidget>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-2.5 rounded-full border bg-muted focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={(!newMsg.trim() && !pendingImage) || sending}
                    size="icon"
                    className="rounded-full w-10 h-10 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-semibold text-lg mb-2">Pilih Percakapan</p>
                <p className="text-sm text-muted-foreground">Pilih kontak di sebelah kiri untuk mulai chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
