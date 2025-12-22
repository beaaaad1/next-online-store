"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/app/utils/formatPrice";
import toast from "react-hot-toast";

// Интерфейсы для типизации
interface IProduct {
    _id: string;
    description: string;
    brand: string;
    basePrice: number;
    oldPrice?: number;
    img: string;
    sizes: string[];
    categories: string[];
    discountPercent?: number;
}

interface IOrder {
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    deliveryPoint: string;
    userId?: string;
    items?: {
        img: string;
        description: string;
        basePrice: number;
    }[];
}

const STATUSES = ["В обработке", "Подтвержден", "В пути", "Доставлен", "Возврат"];

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<"orders" | "products" | "messages">("orders");

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const [chats, setChats] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [currentChat, setCurrentChat] = useState<any[]>([]);
    const [adminMsg, setAdminMsg] = useState("");

    const [newProduct, setNewProduct] = useState({
        description: "",
        brand: "",
        basePrice: "",
        oldPrice: "",
        img: "",
        sizes: "",
        isNew: false,
        isSale: false,
        discountPercent: "10"
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Файл слишком большой (макс. 2Мб)");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct({ ...newProduct, img: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const fetchOrders = async () => {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
    };

    const fetchProducts = async () => {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    };

    const fetchChats = async () => {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setChats(Array.isArray(data) ? data : []);
    };

    const fetchUserChat = async (userId: string) => {
        const res = await fetch(`/api/messages?userId=${userId}`);
        const data = await res.json();
        setCurrentChat(Array.isArray(data) ? data : []);
    };

    const handleAdminSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminMsg.trim() || !selectedUser) return;

        const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: selectedUser, text: adminMsg })
        });

        if (res.ok) {
            setAdminMsg("");
            fetchUserChat(selectedUser);
            toast.success("Ответ отправлен");
        }
    };

    useEffect(() => {
        if ((session?.user as any)?.role === "admin") {
            Promise.all([fetchOrders(), fetchProducts(), fetchChats()]).then(() => setLoading(false));
        }
    }, [session]);

    useEffect(() => {
        if (activeTab === "messages") fetchChats();
    }, [activeTab]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.img) return toast.error("Добавьте фото");

        const categories = [];
        if (newProduct.isNew) categories.push("new");
        if (newProduct.isSale) categories.push("sale");

        const sizesArray = newProduct.sizes.split(",").map(s => s.trim()).filter(s => s !== "");

        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: newProduct.description,
                brand: newProduct.brand,
                basePrice: Number(newProduct.basePrice),
                oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
                img: newProduct.img,
                sizes: sizesArray,
                categories,
                discountPercent: newProduct.isSale ? Number(newProduct.discountPercent) : 0,
            }),
        });

        if (res.ok) {
            toast.success("Товар добавлен!");
            setNewProduct({ description: "", brand: "", basePrice: "", oldPrice: "", img: "", sizes: "", isNew: false, isSale: false, discountPercent: "10" });
            fetchProducts();
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Удалить?")) return;
        const res = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        if (res.ok) { toast.success("Удалено"); fetchProducts(); }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const res = await fetch("/api/admin/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, newStatus }),
        });
        if (res.ok) {
            toast.success(`Статус: ${newStatus}`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Удалить заказ?")) return;
        const res = await fetch("/api/admin/orders", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
            toast.success("Заказ удален");
            setOrders(prev => prev.filter(o => o._id !== orderId));
        }
    };

    if (status === "loading") return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Проверка доступа...</div>;

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
            <h1 className="text-4xl font-black text-slate-800 mb-8 tracking-tighter italic uppercase">Admin Control</h1>

            <div className="flex gap-2 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
                <button onClick={() => setActiveTab("orders")} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-white shadow-md text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>Заказы ({orders.length})</button>
                <button onClick={() => setActiveTab("products")} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-white shadow-md text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>Товары ({products.length})</button>
                <button onClick={() => setActiveTab("messages")} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "messages" ? "bg-white shadow-md text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>Сообщения ({chats.length})</button>
            </div>

            {activeTab === "products" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 animate-in fade-in duration-500">
                    <div className="lg:col-span-3">
                        <form onSubmit={handleAddProduct} className="bg-white rounded-[40px] border-2 border-slate-800 overflow-hidden shadow-[12px_12px_0px_0px_rgba(30,41,59,1)] sticky top-10">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/5 bg-slate-50 p-8 border-b-2 md:border-b-0 md:border-r-2 border-slate-800 flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Изображение товара</p>
                                    <div className="relative aspect-square rounded-3xl border-4 border-dashed border-slate-200 hover:border-slate-800 transition-colors overflow-hidden group">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="admin-file-upload" />
                                        <label htmlFor="admin-file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                            {newProduct.img ? (
                                                <img src={newProduct.img} alt="Preview" className="w-full h-full object-contain p-4 bg-white" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400">Нажмите для загрузки</p>
                                                </div>
                                            )}
                                        </label>
                                        {newProduct.img && (
                                            <button type="button" onClick={() => setNewProduct({...newProduct, img: ""})} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-transform">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="md:w-3/5 p-8 lg:p-10 space-y-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-2xl font-black uppercase italic text-slate-800">Создание товара</h3>
                                        <div className="flex gap-2">
                                            <label className={`px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${newProduct.isNew ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-100 text-slate-300'}`}>
                                                <input type="checkbox" className="hidden" checked={newProduct.isNew} onChange={e => setNewProduct({...newProduct, isNew: e.target.checked})} />
                                                <span className="text-[12px] font-black uppercase tracking-tighter">New</span>
                                            </label>
                                            <label className={`px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${newProduct.isSale ? 'bg-red-500 border-red-500 text-white' : 'border-slate-100 text-slate-300'}`}>
                                                <input type="checkbox" className="hidden" checked={newProduct.isSale} onChange={e => setNewProduct({...newProduct, isSale: e.target.checked})} />
                                                <span className="text-[12px] font-black uppercase tracking-tighter">Sale</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Производитель</label>
                                            <input type="text" placeholder="ABB" required className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 focus:bg-white outline-none font-bold transition-all text-sm" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Модель</label>
                                            <input type="text" placeholder="S201 C16" required className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 focus:bg-white outline-none font-bold transition-all text-sm" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Базовая цена</label>
                                            <div className="relative">
                                                <input type="number" placeholder="0" required className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 focus:bg-white outline-none font-black text-green-600 transition-all" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: e.target.value})} />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">₽</span>
                                            </div>
                                        </div>
                                        {newProduct.isSale ? (
                                            <div className="space-y-1 animate-in slide-in-from-left-2">
                                                <label className="text-[9px] font-black text-red-500 uppercase ml-1">Размер скидки (%)</label>
                                                <select
                                                    className="w-full p-3.5 bg-red-50 rounded-2xl border-2 border-red-100 focus:border-red-500 outline-none font-black text-red-500 appearance-none"
                                                    value={newProduct.discountPercent}
                                                    onChange={e => setNewProduct({...newProduct, discountPercent: e.target.value})}
                                                >
                                                    {[5, 10, 15, 20, 25, 30, 40, 50, 70].map(val => (
                                                        <option key={val} value={val}>{val}% скидка</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Старая цена (опц.)</label>
                                                <input type="number" placeholder="0" className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 focus:bg-white outline-none font-bold text-slate-300" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Характеристики (через запятую)</label>
                                        <input type="text" placeholder="230V, 16A, IP20" className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 focus:bg-white outline-none font-bold transition-all text-sm" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
                                    </div>

                                    <button type="submit" className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shadow-lg">
                                        Опубликовать товар
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 mb-2">Активные товары ({products.length})</p>
                        {products.map(p => (
                            <div key={p._id} className="bg-white p-4 rounded-[28px] border-2 border-slate-100 flex gap-4 items-center group hover:border-slate-800 transition-all relative">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-50 overflow-hidden flex-shrink-0">
                                    <img src={p.img} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-1 mb-1">
                                        {p.categories.map(cat => (
                                            <span key={cat} className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md ${cat === 'sale' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}`}>{cat}</span>
                                        ))}
                                    </div>
                                    <p className="font-black text-slate-800 truncate text-sm leading-tight">{p.description}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{p.brand}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-md font-black text-[#ff6633] italic">{formatPrice(p.basePrice)} ₽</p>
                                        {p.discountPercent ? <span className="text-[10px] font-black text-red-500">-{p.discountPercent}%</span> : null}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteProduct(p._id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "orders" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Заказов пока нет</div>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="bg-white border-2 border-slate-800 rounded-[40px] overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
                                <button onClick={() => handleDeleteOrder(order._id)} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors z-10">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    <div className="lg:col-span-5 p-10 bg-slate-50 border-r-2 border-slate-800">
                                        <div className="mb-8">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Заказ №{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-4xl font-black text-slate-800 italic tracking-tighter">{formatPrice(order.totalPrice)} ₽</p>
                                            <p className="text-xs font-bold text-slate-400 mt-2">{new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Покупатель</p>
                                                <p className="text-sm font-black text-slate-700">{order.userId || "Гостевой заказ"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Пункт выдачи</p>
                                                <p className="text-sm font-black text-slate-700 leading-relaxed">📍 {order.deliveryPoint}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-7 p-10 flex flex-col justify-between bg-white">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Состав корзины</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-transparent hover:border-slate-800 transition-all">
                                                        <div className="w-14 h-14 bg-white rounded-xl p-1 flex-shrink-0 border border-slate-100">
                                                            <img src={item.img} className="w-full h-full object-contain" alt=""/>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tighter">{item.description}</p>
                                                            <p className="text-[11px] font-black text-[#ff6633]">{formatPrice(item.basePrice)} ₽</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-10 pt-8 border-t-2 border-slate-50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Изменить статус</p>
                                            <div className="flex flex-wrap gap-2">
                                                {STATUSES.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleStatusChange(order._id, s)}
                                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${order.status === s ? "bg-slate-800 text-white border-slate-800 shadow-lg scale-105" : "bg-white text-slate-400 border-slate-100 hover:border-slate-800 hover:text-slate-800"}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "messages" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[70vh] animate-in fade-in duration-500">
                    <div className="lg:col-span-4 bg-white rounded-[32px] border-2 border-slate-800 overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]">
                        <div className="p-6 border-b-2 border-slate-800 bg-slate-50">
                            <h3 className="font-black uppercase italic text-sm">Все диалоги</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {chats.map((chat) => (
                                <button
                                    key={chat._id}
                                    onClick={() => { setSelectedUser(chat._id); fetchUserChat(chat._id); }}
                                    className={`w-full p-6 text-left border-b border-slate-100 transition-all hover:bg-slate-50 ${selectedUser === chat._id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''}`}
                                >
                                    <p className="font-black text-[10px] text-blue-600 truncate mb-1 uppercase tracking-tighter">{chat._id}</p>
                                    <p className="text-xs font-bold text-slate-800 truncate">{chat.lastMessage}</p>
                                    <p className="text-[8px] font-black text-slate-300 uppercase mt-2">
                                        {new Date(chat.lastDate).toLocaleString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white rounded-[40px] border-2 border-slate-800 shadow-[10px_10px_0px_0px_rgba(30,41,59,1)] overflow-hidden flex flex-col">
                        {selectedUser ? (
                            <>
                                <div className="p-6 border-b-2 border-slate-800 flex justify-between items-center bg-white shadow-sm">
                                    <p className="font-black text-xs uppercase italic tracking-tighter text-blue-600">{selectedUser}</p>
                                    <button onClick={() => fetchUserChat(selectedUser)} className="bg-slate-100 p-2 px-4 rounded-xl text-slate-800 font-black text-[9px] uppercase hover:bg-slate-800 hover:text-white transition-all">
                                        Обновить
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
                                    {currentChat.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-4 rounded-3xl shadow-sm ${msg.isAdmin ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border-2 border-slate-100 text-slate-800 rounded-tl-none'}`}>
                                                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                                <p className="text-[8px] mt-2 opacity-50 font-black uppercase">
                                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAdminSend} className="p-6 bg-white border-t-2 border-slate-800 flex gap-4">
                                    <input
                                        type="text"
                                        value={adminMsg}
                                        onChange={(e) => setAdminMsg(e.target.value)}
                                        placeholder="Введите ответ..."
                                        className="flex-1 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-800 outline-none font-bold transition-all"
                                    />
                                    <button className="bg-slate-800 text-white px-8 rounded-2xl font-black uppercase text-xs hover:bg-slate-700 active:scale-95 transition-all">
                                        Отправить
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest italic">
                                Выберите диалог
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}