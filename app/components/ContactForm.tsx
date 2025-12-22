"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ContactForm() {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            if (Array.isArray(data)) setChat(data);
        } catch (error) {
            console.error("Ошибка загрузки чата", error);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    useEffect(() => {
        if (session) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 10000);
            return () => clearInterval(interval);
        }
    }, [session]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                body: JSON.stringify({ text: message }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                setMessage("");
                await fetchMessages();
            } else {
                toast.error("Ошибка при отправке");
            }
        } catch (error) {
            toast.error("Проблема с сетью");
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="font-black text-slate-400 uppercase text-xs tracking-widest">
                    Авторизуйтесь, чтобы начать чат с поддержкой
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[450px]">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar"
            >
                {chat.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">История сообщений пуста</p>
                    </div>
                ) : (
                    chat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${
                                msg.isAdmin 
                                ? 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200' 
                                : 'bg-blue-600 text-white rounded-tr-none'
                            }`}>
                                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                <p className={`text-[9px] mt-2 font-black uppercase opacity-50 ${msg.isAdmin ? 'text-slate-500' : 'text-blue-100'}`}>
                                    {msg.isAdmin ? 'Поддержка' : 'Вы'} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Напишите ваш вопрос..."
                    className="flex-1 px-5 py-3 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-sm bg-white shadow-sm"
                />
                <button
                    disabled={loading}
                    className="bg-blue-600 text-white p-3 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? "..." : "Отправить"}
                </button>
            </form>
        </div>
    );
}