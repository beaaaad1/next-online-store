"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ContactForm() {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiMode, setAiMode] = useState(true);
    const [aiTyping, setAiTyping] = useState(false);
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
    }, [chat, aiTyping]);

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
        const currentMessage = message;
        setMessage("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                body: JSON.stringify({ text: currentMessage }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                toast.error("Ошибка при отправке");
                setLoading(false);
                return;
            }

            await fetchMessages();

            if (aiMode) {
                setAiTyping(true);
                try {
                    const aiRes = await fetch("/api/ai-chat", {
                        method: "POST",
                        body: JSON.stringify({ message: currentMessage }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const aiData = await aiRes.json();
                    const reply = aiData.reply;

                    await fetch("/api/messages", {
                        method: "POST",
                        body: JSON.stringify({
                            text: reply,
                            isAiReply: true
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    await fetchMessages();
                } catch {
                    toast.error("ИИ временно недоступен");
                } finally {
                    setAiTyping(false);
                }
            }

        } catch (error) {
            toast.error("Проблема с сетью");
        } finally {
            setLoading(false);
        }
    };

    const callOperator = async () => {
        setAiMode(false);
        try {
            await fetch("/api/messages", {
                method: "POST",
                body: JSON.stringify({
                    text: "🔔 Пользователь запросил живого оператора",
                    isAiReply: true
                }),
                headers: { "Content-Type": "application/json" }
            });
            await fetchMessages();
            toast.success("Оператор скоро подключится!");
        } catch {
            toast.error("Ошибка при вызове оператора");
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
        <div className="flex flex-col h-[500px]">

            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${aiMode ? 'bg-green-400' : 'bg-blue-500'}`}/>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {aiMode ? 'ИИ-ассистент' : 'Живой оператор'}
                    </p>
                </div>
                {aiMode && (
                    <button
                        onClick={callOperator}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-all border border-blue-200 rounded-xl px-3 py-1 hover:bg-blue-50"
                    >
                        Позвать оператора
                    </button>
                )}
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar"
            >
                {chat.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                            Задайте любой вопрос — ИИ-ассистент ответит мгновенно
                        </p>
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
                                    {msg.isAdmin
                                        ? (msg.isBot ? 'ИИ-ассистент' : 'Оператор')
                                        : 'Вы'
                                    } • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                {aiTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 border border-slate-200 p-4 rounded-3xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1 items-center h-4">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                            </div>
                            <p className="text-[9px] mt-2 font-black uppercase opacity-50 text-slate-500">ИИ печатает...</p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={aiMode ? "Задайте вопрос ИИ-ассистенту..." : "Напишите оператору..."}
                    className="flex-1 px-5 py-3 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-sm bg-white shadow-sm"
                />
                <button
                    disabled={loading || aiTyping}
                    className="bg-blue-600 text-white p-3 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading || aiTyping ? "..." : "Отправить"}
                </button>
            </form>
        </div>
    );
}