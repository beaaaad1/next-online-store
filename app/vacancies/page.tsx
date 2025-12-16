import { vacancy } from '@/app/types/vacancy';

const VacancyCard = ({ vacancy }: { vacancy: vacancy }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-between h-full">
        <div>
            <h3 className="text-2xl font-bold mb-2 text-blue-700">{vacancy.title}</h3>
            <p className="text-sm font-semibold text-gray-500 mb-4">{vacancy.location}</p>

            <p className="mb-4 text-gray-700">{vacancy.description}</p>

            <h4 className="font-semibold mb-2 text-gray-800">Требования:</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-600">
                {vacancy.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
            </ul>
        </div>

        <div className="mt-6">
            <a
                href={`mailto:hr@rosseti-store.ru?subject=Отклик на вакансию: ${vacancy.title}`}
                className="inline-block w-full text-center bg-green-500 text-white px-5 py-2 rounded-full font-medium hover:bg-green-600 transition-colors duration-300"
            >
                Отправить резюме
            </a>
        </div>
    </div>
);


const VacanciesPage = async () => {
    let vacancies: vacancy[] = [];
    let error: string | null = null;

    try {
        const url = `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/vacancies`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Ошибка HTTP: ${res.status}`);
        }

        vacancies = await res.json();

    } catch (err) {
        error = "Не удалось загрузить список вакансий. Пожалуйста, попробуйте позже.";
        console.error("Ошибка при получении вакансий:", err);
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">

            <h1 className="text-4xl font-extrabold mb-4 text-blue-700">
                Карьера в «Россети»
            </h1>

            <p className="text-lg mb-10 text-gray-700 leading-relaxed border-b pb-6">
                Мы ищем амбициозных и талантливых профессионалов, готовых развиваться вместе с крупнейшим
                энергохолдингом страны.
            </p>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Ошибка загрузки</p>
                    <p>{error}</p>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Актуальные вакансии
            </h2>

            {vacancies.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vacancies.map((vacancy) => (
                        <VacancyCard key={vacancy.id} vacancy={vacancy} />
                    ))}
                </div>
            ) : (
                <p className="text-xl text-gray-500 text-center py-10">
                    На данный момент открытых вакансий нет. Следите за обновлениями!
                </p>
            )}

            <div className="mt-16 p-8 bg-blue-50 rounded-xl shadow-inner border-l-4 border-blue-400">
                 <h2 className="text-2xl font-bold mb-4 text-blue-700">
                    Наши преимущества
                </h2>
                <ul className="list-disc list-outside ml-6 space-y-3 text-gray-700">
                    <li>**Стабильность и надежность:** Работа в компании федерального масштаба.</li>
                    <li>**Профессиональное развитие:** Регулярное обучение и программы наставничества.</li>
                </ul>
            </div>

        </div>
    );
}

export default VacanciesPage;