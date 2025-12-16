// app/components/header/CatalogDropdown.tsx

"use client"; // Обязательно указываем, что это клиентский компонент, так как используем хуки React

import Link from 'next/link';
// useState: для отслеживания, открыто ли меню
// useRef: для ссылки на DOM-элемент (чтобы знать, куда кликнул пользователь)
// useEffect: для добавления и удаления слушателя события (для закрытия по клику вне меню)
import { useState, useRef, useEffect } from 'react';

// Описание структуры пункта меню (интерфейс)
interface DropdownItem {
  name: string; // Название ссылки
  href: string; // Путь к странице
}

// Список всех пунктов меню
const menuItems: DropdownItem[] = [
  { name: 'О компании', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'Вакансии', href: '/vacancies' },
  { name: 'Статьи', href: '/articles' },
];

const CatalogDropdown = () => {
  // Инициализация состояния: по умолчанию меню закрыто (false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Создаем ref для всего контейнера выпадающего меню
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Функция для переключения состояния меню
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Хук useEffect для обработки кликов вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Если клик произошел, и он не внутри нашего контейнера (dropdownRef), то закрываем меню
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Добавляем слушатель события на весь документ
    document.addEventListener('mousedown', handleClickOutside);

    // Функция очистки: убираем слушатель при удалении компонента (важно для производительности!)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Пустой массив [] - эффект запустится только один раз при монтировании

  return (
    // Контейнер, на который вешается ref и который имеет 'relative' позиционирование
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleMenu}
        // Адаптивные классы для кнопки:
        // w-14 h-14: Квадратная кнопка на маленьких экранах (по умолчанию)
        // lg:w-full lg:min-w-[150px]: Широкая кнопка на больших экранах
        // justify-center: Центрирует содержимое на маленьких экранах
        // lg:justify-between: Распределяет содержимое по краям на больших экранах
        className="bg-(--color-primary) hover:shadow-(--shadow-button-default)
                   active:shadow-(--shadow-button-active) flex p-4 gap-3
                   cursor-pointer rounded duration-300 items-center
                   w-14 h-14 lg:w-full lg:min-w-[150px] justify-center lg:justify-between"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {/* Иконка меню (Видна всегда) */}
        {/* В реальном проекте используй компонент Next/Image для оптимизации */}
        <img
            src="/icons-header/menu.svg"
            alt="Меню Каталог"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
        />

        {/* Текст "Каталог": Скрыт на маленьких, показан на больших (lg:block) */}
        <span className="text-white font-medium whitespace-nowrap hidden lg:block">Каталог</span>

        {/* Стрелка: Скрыта на маленьких, показана на больших (lg:block).
            Поворачивается, когда меню открыто. */}
        <svg
            className={`w-4 h-4 ml-2 transform ${isMenuOpen ? 'rotate-180' : ''} transition-transform duration-200 hidden lg:block`}
            fill="white"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>

      </button>

      {/* Выпадающий список: отображается только, если isMenuOpen === true */}
      {isMenuOpen && (
        // absolute: позиционируется относительно родителя
        // top-full: располагается сразу под кнопкой
        // w-60: фиксированная ширина для выпадающего списка
        // z-20: гарантирует, что список будет поверх всех остальных элементов шапки
        <div className="absolute top-full left-0 mt-1 w-60 bg-white shadow-lg rounded-md z-20 border border-gray-100">
          <ul className="py-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a
                    // При клике на любую ссылку закрываем меню для удобства пользователя
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-150 text-base"
                  >
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CatalogDropdown;