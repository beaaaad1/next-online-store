const ContactsPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">

            <h1 className="text-4xl font-extrabold mb-8 text-blue-700 border-b-4 border-blue-500 pb-3">
                Связаться с нами
            </h1>

            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
                Команда интернет-магазина «Россети» всегда готова ответить на ваши вопросы и помочь с оформлением заказа.
                Ниже вы найдете все необходимые способы связи с нашими специалистами. Мы ценим ваше время и стремимся
                предоставить максимально быструю и полную поддержку.
            </p>

            <div className="grid md:grid-cols-2 gap-10 mb-12">

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Центральный офис и поддержка
                    </h2>

                    <div className="mb-4">
                        <p className="font-semibold text-lg text-blue-600">Адрес:</p>
                        <p className="text-gray-600">ул. Маршала Жукова, 44, Оренбург, Оренбургская обл., 460024</p>
                    </div>

                    <div className="mb-4">
                        <p className="font-semibold text-lg text-blue-600">Электронная почта:</p>
                        <a href="mailto:support@rosseti-store.ru" className="text-blue-500 hover:text-blue-700 duration-300">
                            support@rosseti-store.ru
                        </a>
                    </div>

                    <div>
                        <p className="font-semibold text-lg text-blue-600">График работы:</p>
                        <p className="text-gray-600">Пн-Пт: 9:00 - 18:00 </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Горячая линия и мессенджеры
                        </h2>

                        <div className="phone mb-8">
                            <p className="font-semibold text-lg text-blue-600">Единый контакт-центр:</p>
                            <a
                                href="tel:+78007773333"
                                className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
                            >
                                <img
                                    src="/images/icons-footer/phone.svg"
                                    alt="Позвонить по телефону"
                                    width={30}
                                    height={30}
                                    className="object-contain"
                                />
                                8 800 777 33 33
                            </a>
                            <p className="text-sm text-gray-500 mt-1">Звонок бесплатный по России. Круглосуточно.</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-lg text-blue-600 mb-3">Мы в социальных сетях:</p>
                        <div className="social flex flex-row gap-x-4 md:flex-col xl:flex-row gap-y-3 justify-start">
                            <div className="flex gap-x-4 items-center">
                                {/* VKontakte */}
                                <a href="https://vk.com/rosseti" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/images/icons-footer/vk.svg"
                                        alt="VKontakte"
                                        width={40}
                                        height={40}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                </a>
                                {/* Odnoklassniki */}
                                <a href="https://ok.ru/fsk.rosseti" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/images/icons-footer/od.svg"
                                        alt="Odnoklassniki"
                                        width={40}
                                        height={40}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                </a>
                            </div>
                            <div className="flex gap-x-4 items-center">
                                {/* Rutube */}
                                <a
                                    href="https://rutube.ru/channel/24249867/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/images/icons-footer/rutube.svg"
                                        alt="rutube"
                                        width={70}
                                        height={70}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                </a>
                                {/* Telegram */}
                                <a
                                    href="https://t.me/rosseti_official"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src="/images/icons-footer/tg.svg"
                                        alt="Telegram"
                                        width={40}
                                        height={40}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner">
                 <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Напишите нам
                </h2>
                <p className="mb-4 text-gray-600">
                    Если у вас есть общие вопросы, предложения или пожелания, вы можете воспользоваться формой
                    обратной связи. Мы обязательно свяжемся с вами в рабочее время.
                </p>

                <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
                    Место для компонента формы обратной связи (ContactForm)
                </div>
            </div>

            <div className="mt-12">
                 <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Наше расположение: г. Оренбург, ул. Маршала Жукова, 44
                </h2>

                <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl border border-gray-300">

                    <iframe
                        src="https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=55.111257%2C51.771555&mode=whatshere&whatshere%5Bpoint%5D=55.110717%2C51.771883&whatshere%5Bzoom%5D=17&z=16"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        allowFullScreen={true}
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Яндекс.Карта: Оренбург, ул. Маршала Жукова, 44"
                    ></iframe>
                </div>
            </div>

        </div>
    );
}

export default ContactsPage;