"use client";

import { useState } from "react";
import { Send, Image as ImageIcon, Smile, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTACTS = [
  { id: 1, name: "Budi Santoso", role: "Pelanggan", lastMessage: "Siang, untuk tanggal 20 besok apakah jadwal jam 8 pagi masih kosong?", time: "10:29", unread: 1, online: true },
  { id: 2, name: "Siti Aminah", role: "Pelanggan", lastMessage: "Terima kasih atas pelayanannya kak!", time: "Kemarin", unread: 0, online: false },
  { id: 3, name: "Rina Wijaya", role: "Pelanggan", lastMessage: "Apakah bisa request gaya rambut seperti ini?", time: "Senin", unread: 0, online: true },
];

export default function VendorChatPage() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);

  return (
    <div className="bg-card rounded-3xl border h-[calc(100vh-140px)] flex overflow-hidden animate-in fade-in duration-500">
      
      {/* Sidebar Contacts */}
      <div className="w-1/3 border-r flex flex-col bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg font-heading mb-4">Pesan Masuk</h2>
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
          {CONTACTS.map((contact) => (
            <div 
              key={contact.id} 
              onClick={() => setActiveContact(contact)}
              className={`p-4 border-b cursor-pointer transition-colors flex gap-3 ${activeContact.id === contact.id ? "bg-primary/5" : "hover:bg-muted/50"}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                  {contact.name.charAt(0)}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                  <span className="text-xs text-muted-foreground">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
              {activeContact.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold">{activeContact.name}</h3>
              <p className="text-xs text-muted-foreground">{activeContact.role} • {activeContact.online ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><Video className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
          <div className="flex justify-center">
            <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">Hari ini</span>
          </div>
          
          {/* Vendor Message (Self) */}
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
              <p className="text-sm">Halo kak, ada yang bisa kami bantu terkait layanan makeup wisuda?</p>
              <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">10:28</span>
            </div>
          </div>

          {/* Customer Message */}
          <div className="flex justify-start">
            <div className="bg-card border px-4 py-2 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm">
              <p className="text-sm">{activeContact.lastMessage}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">{activeContact.time}</span>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2 bg-muted/50 border rounded-full px-2 py-2">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground shrink-0">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <input 
              type="text" 
              placeholder="Balas pesan pelanggan..." 
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm px-2"
            />
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground shrink-0">
              <Smile className="w-5 h-5" />
            </Button>
            <Button className="rounded-full shrink-0 h-10 w-10 p-0 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
