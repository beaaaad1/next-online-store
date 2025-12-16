"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonFooter from "@/app/components/ButtonFooter";

const Footer = () => {
  return (
    <footer className="bg-[#125DF2]  mb-14 md:mb-0 px-[max(12px,calc((100%-1208px)/2))] w-full">
      <div className="px-7 py-10 grid-container gap-6 text-[#fff] md:gap-x-10 items-center pb-40">

        <div className="logo">

  <Link href="/" className="block">
    <img
      src="/images/icons-footer/logo.svg"
      alt="Логотип"
      className="w-32 h-auto md:w-40"
    />
  </Link>

        </div>

        {/* Социальные сети с кликабельными иконками */}
        <div className="social flex flex-row gap-x-2 md:flex-col xl:flex-row gap-y-3 justify-between">
          <div className="flex gap-x-2 items-start">
            <a href="https://vk.com/rosseti" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/icons-footer/vk.svg"
                alt="VKontakte"
                width={40}
                height={40}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
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
          <div className="flex gap-x-2 items-start">
            <a
              href="https://rutube.ru/channel/24249867/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/icons-footer/rutube.svg"
                alt="rutube"
                width={40}
                height={40}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
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

        {/* Телефон с кликом */}
        <div className="phone">
          <a
            href="tel:+78007773333"
            className="flex items-center gap-x-2 hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="/images/icons-footer/phone.svg"
              alt="Позвонить по телефону"
              width={30}
              height={30}
              className="hover:opacity-80 transition-opacity duration-300 relative top-1"
            />
            <p className="text-base hover:text-black duration-300">
              8 800 777 33 33
            </p>
          </a>
        </div>

        {/* Навигация с кликабельными пунктами */}
        <nav className="nav">
          <ul className="flex flex-wrap gap-x-8 gap-4 xl:gap-y-2 md:gap-x-10">
            <li className="hover:text-black cursor-pointer">
              <ButtonFooter btnText="О компании" href="about"/>
            </li>
            <li className="hover:text-black cursor-pointer">
              <ButtonFooter btnText="Контакты" href="contacts"/>
            </li>
            <li className="hover:text-black cursor-pointer">
              <ButtonFooter btnText="Вакансии" href="vacancies"/>
            </li>
            <li className="hover:text-black cursor-pointer">
              <ButtonFooter btnText="Статьи" href="articles"/>
            </li>
            <li className="hover:text-black cursor-pointer">
              Политика обработки персональных данных
            </li>
          </ul>
        </nav>



      </div>


      <style jsx>{`
        /* Базовые стили для мобильных (mobile-first) */
        .grid-container {
          display: grid;
          grid-template-areas:
            "logo social"
            "logo phone"
            "nav nav"
            "design design";
          grid-template-columns: 1fr 1fr;
        }

        .logo {
          grid-area: logo;
        }
        .social {
          grid-area: social;
          justify-self: end;
        }
        .phone {
          grid-area: phone;
          justify-self: end;
        }
        .nav {
          grid-area: nav;
        }
        .design {
          grid-area: design;
        }

        /* Средние экраны (768px и больше) */
        @media (min-width: 768px) {
          .grid-container {
            grid-template-areas:
              "logo nav social phone"
              "logo nav social design";
            grid-template-columns: auto 1fr auto auto;
          }
        }
      `}</style>

    </footer>
  );
};

export default Footer;