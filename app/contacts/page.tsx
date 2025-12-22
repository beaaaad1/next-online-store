"use client";

import ContactForm from "@/app/components/ContactForm";

const ContactsPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">

            <h1 className="text-4xl font-extrabold mb-8 text-blue-700 border-b-4 border-blue-500 pb-3 italic uppercase tracking-tighter">
                Связаться с нами
            </h1>

            <p className="text-lg mb-8 text-gray-700 leading-relaxed font-medium">
                Команда интернет-магазина «Россети» всегда готова ответить на ваши вопросы и помочь с оформлением заказа.
                Ниже вы найдете все необходимые способы связи с нашими специалистами. Мы ценим ваше время и стремимся
                предоставить максимально быструю и полную поддержку.
            </p>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tight">
                        Центральный офис
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <p className="font-black text-[10px] uppercase text-blue-600 tracking-widest mb-1">Адрес</p>
                            <p className="text-gray-600 font-bold">ул. Маршала Жукова, 44, Оренбург, 460024</p>
                        </div>

                        <div>
                            <p className="font-black text-[10px] uppercase text-blue-600 tracking-widest mb-1">Электронная почта</p>
                            <a href="mailto:support@rosseti-store.ru" className="text-blue-500 font-black hover:text-blue-700 transition-colors">
                                support@rosseti-store.ru
                            </a>
                        </div>

                        <div>
                            <p className="font-black text-[10px] uppercase text-blue-600 tracking-widest mb-1">График работы</p>
                            <p className="text-gray-600 font-bold">Пн-Пт: 9:00 — 18:00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300">
                    <div>
                        <h2 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tight">
                            Горячая линия
                        </h2>

                        <div className="mb-8">
                            <p className="font-black text-[10px] uppercase text-blue-600 tracking-widest mb-2">Единый контакт-центр</p>
                            <a
                                href="tel:+78007773333"
                                className="text-3xl font-black text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-3"
                            >
                                <img src="/images/icons-footer/phone.svg" alt="" className="w-8 h-8" />
                                8 800 777 33 33
                            </a>
                            <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase">Бесплатно по РФ. Круглосуточно.</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-black text-[10px] uppercase text-blue-600 tracking-widest mb-4">Мы в мессенджерах</p>
                        <div className="flex flex-wrap gap-4">
                            <a href="https://vk.com/rosseti" target="_blank" className="hover:scale-110 transition-transform"><img src="/images/icons-footer/vk.svg" width={40} alt="VK" /></a>
                            <a href="https://ok.ru/fsk.rosseti" target="_blank" className="hover:scale-110 transition-transform"><img src="/images/icons-footer/od.svg" width={40} alt="OK" /></a>
                            <a href="https://t.me/rosseti_official" target="_blank" className="hover:scale-110 transition-transform"><img src="/images/icons-footer/tg.svg" width={40} alt="TG" /></a>
                            <a href="https://rutube.ru/channel/24249867/" target="_blank" className="hover:scale-110 transition-transform"><img src="/images/icons-footer/rutube.svg" width={60} alt="Rutube" /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 bg-slate-800 rounded-[40px] p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(30,41,59,0.1)]">
                 <div className="max-w-2xl">
                    <h2 className="text-3xl font-black mb-4 text-white italic uppercase tracking-tighter">
                        Прямая связь с поддержкой
                    </h2>
                    <p className="mb-8 text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                        Ваши сообщения попадают напрямую администраторам. Вы получите ответ в этом же окне чата.
                    </p>

                    <div className="bg-white rounded-[32px] p-2 overflow-hidden shadow-2xl">
                        <ContactForm />
                    </div>
                 </div>
            </div>

            {/* КАРТА */}
            <div className="mt-20">
                 <h2 className="text-2xl font-black mb-6 text-gray-800 uppercase italic tracking-tight">
                    Наш офис в Оренбурге
                </h2>

                <div className="w-full h-[450px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=55.111257%2C51.771555&mode=whatshere&whatshere%5Bpoint%5D=55.110717%2C51.771883&whatshere%5Bzoom%5D=17&z=16"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        allowFullScreen={true}
                        title="Карта"
                    ></iframe>
                </div>
            </div>

        </div>
    );
}

export default ContactsPage;