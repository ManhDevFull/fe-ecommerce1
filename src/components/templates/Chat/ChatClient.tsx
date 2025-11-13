"use client";
import axiosClient from "@/axios/axiosClient";
import { addAuth, authSelector, UserAuth } from "@/redux/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { chatApiBase, chatHubUrl } from "@/utils/env";

const CHAT_API_BASE = chatApiBase;
const CHAT_HUB_URL = chatHubUrl;
const envAdminId = Number(process.env.NEXT_PUBLIC_CHAT_ADMIN_ID ?? "1");
const DEFAULT_ADMIN_ID = Number.isFinite(envAdminId) ? envAdminId : 1;

type ChatMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
};

type ThreadResponse = {
  contactId: number;
  contactName: string;
  avatarInitials: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
};

export function ChatClient() {
  const dispatch = useDispatch();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const auth: UserAuth = useSelector(authSelector);
  const [userInfo, setUserInfo] = useState<UserAuth>(auth);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminContactId, setAdminContactId] =
    useState<number>(DEFAULT_ADMIN_ID);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatOpenedRef = useRef(false);
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const res = localStorage.getItem("token");
    if (res) {
      const parsed = JSON.parse(res);
      dispatch(addAuth(parsed));
      setUserInfo(parsed);
    }
  }, [dispatch]);
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    },
    []
  );

  useEffect(() => {
    if (!isChatOpen) {
      chatOpenedRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    if (!chatOpenedRef.current) {
      scrollToBottom("auto");
      chatOpenedRef.current = true;
      prevMessageCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMessageCountRef.current) {
      const behavior =
        prevMessageCountRef.current === 0 ? "auto" : "smooth";
      scrollToBottom(behavior);
    }

    prevMessageCountRef.current = messages.length;
  }, [isChatOpen, messages.length, scrollToBottom]);

  // 🚀 Gọi API để lấy thread giữa client ↔ admin
  const fetchThread = async () => {
    if (!userInfo?.token) return;
    try {
      setLoading(true);
      const res = await axiosClient.get<ThreadResponse[]>(
        `${CHAT_API_BASE}/messages/grouped`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const data = res.data ?? res;
      console.log(res.data);
      if (data.length > 0) {
        const adminThread = data[0];
        setMessages(adminThread.messages ?? []);
        setAdminContactId(adminThread.contactId || DEFAULT_ADMIN_ID);
      } else {
        setMessages([]);
        setAdminContactId(DEFAULT_ADMIN_ID);
      }
    } catch (error) {
      console.error("❌ Fetch chat thread failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) void fetchThread();

    if (!userInfo.token) return;
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_HUB_URL, {
        accessTokenFactory: () => userInfo.token!,
      })
      .withAutomaticReconnect()
      .build();

    conn.on("clientMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    conn
      .start()
      .then(() => {
        console.log("✅ Connected to hub");
        setConnection(conn);
      })
      .catch((err) => console.error("❌ Connect failed", err));

    return () => {
      conn.stop();
    };
  }, [userInfo?.token]);

  const sendMessage = async () => {
    if (!connection) {
      console.warn("⚠️ No connection instance");
      return;
    }

    if (connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("⚠️ Connection not ready:", connection.state);
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      senderId: userInfo.id!,
      receiverId: adminContactId,
      content: trimmed,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    try {
      await connection.invoke("SendMessageByClient", trimmed);
      setInput("");
    } catch (err) {
      console.error("❌ SendMessage failed:", err);
    }
  };

  return (
    <>
      {/* ⚙️ Nút mở chat */}
      {!isChatOpen ? (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center rounded-full bg-blue-500 p-3 text-white shadow-lg hover:bg-blue-600 transition-all"
          aria-label="Open chat"
        >
          <IoChatbubblesOutline size={26} />
        </button>
      ) : (
        <div className="fixed bottom-8 right-8 z-[10000] w-80 bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#3f4a5b] text-white px-4 py-3">
            <p className="font-semibold text-sm">Chat with Admin</p>
            <button onClick={() => setIsChatOpen(false)}>
              <IoClose size={20} />
            </button>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex h-90 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50 max-h-[400px]">
              {loading ? (
                <p className="text-center text-gray-400 text-sm mt-10">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-10">
                  No messages yet.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === userInfo.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                        msg.senderId === userInfo.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input gửi */}
          <div className="flex gap-2 items-center justify-between border-t border-gray-200 py-2 px-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 rounded-full border border-gray-300 h-9 text-sm focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="h-9 px-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
