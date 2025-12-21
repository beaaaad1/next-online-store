"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/app/utils/formatPrice";
import toast from "react-hot-toast";

const STATUSES = ["В обработке", "Подтвержден", "В пути", "Доставлен", "Возврат"];

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const SOFT_DARK = "#334155";

    useEffect(() => {
        if ((session?.user as any)?.role === "admin") {
            fetch("/api/admin/orders")
                .then(res => res.json())
                .then(data => {
                    setOrders(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error("Ошибка загрузки данных");
                    setLoading(false);
                });
        }
    }, [session]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const res = await fetch("/api/admin/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, newStatus }),
        });

        if (res.ok) {
            toast.success(`Статус: ${newStatus}`, {
                style: { border: `1px solid ${SOFT_DARK}`, borderRadius: '12px' }
            });
            setOrders((prev) =>
                prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
            );
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
        );
    }

    if ((session?.user as any)?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                <h1 className="text-red-600 font-black tracking-widest uppercase text-3xl mb-2">
                    Доступ ограничен
                </h1>
                <p className="text-slate-500 font-medium max-w-md">
                    У вашей учетной записи ({session?.user?.email}) недостаточно прав для управления заказами.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[85vh]">
            <div className="max-w-[1200px] w-full mx-auto px-6 py-10">
                <div className="flex justify-between items-end mb-8 border-b pb-4" style={{ borderColor: SOFT_DARK }}>
                    <h1 className="text-3xl font-bold text-slate-800">Управление заказами</h1>
                    <p className="text-slate-400 text-sm font-medium">Всего: {orders.length}</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-400 font-medium">Список заказов пуст</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: SOFT_DARK }}>
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                                        {/* Инфо о заказе */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">ID: {order._id.slice(-8).toUpperCase()}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-bold uppercase">
                                                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-800">{formatPrice(order.totalPrice)} ₽</p>
                                            <div className="text-sm text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p><span className="text-slate-400 uppercase text-[10px] font-bold block">Покупатель:</span> {order.customerData?.email || order.userId || "admin@store.com"}</p>
                                                <p className="pt-2"><span className="text-slate-400 uppercase text-[10px] font-bold block">Пункт выдачи:</span> {order.customerData?.deliveryPoint || order.deliveryPoint}</p>
                                            </div>
                                        </div>

                                        {/* Кнопки управления статусом */}
                                        <div className="flex flex-wrap gap-2 items-center content-start lg:max-w-[360px]">
                                            <p className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Текущий статус: {order.status}</p>
                                            {STATUSES.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(order._id, s)}
                                                    className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all active:scale-95 ${
                                                        order.status === s 
                                                        ? "bg-slate-700 text-white border-slate-700 shadow-md" 
                                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-800 hover:text-slate-800"
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Состав заказа */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Состав заказа:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                                                    {item.img && (
                                                        <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-50">
                                                            <img src={item.img} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                    )}
                                                    <div className="pr-2">
                                                        <p className="text-[11px] font-bold text-slate-700 max-w-[140px] line-clamp-1 leading-tight">
                                                            {item.description}
                                                        </p>
                                                        <p className="text-[11px] font-black text-[#ff6633] mt-0.5">
                                                            {formatPrice(item.basePrice)} ₽
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}