"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoBlock from "@/app/components/header/LogoBlock";
import SearchBlock from "@/app/components/header/SearchBlock";
import CatalogDropdown from "@/app/components/header/CatalogDropdown";
import UserBlock from "@/app/components/header/UserBlock";

const Header = () => {
    const { data: session } = useSession();

    const isAdmin = (session?.user as any)?.role === "admin";

    return (
        <header
            className="bg-white w-full md:shadow-(--shadow-default) relative z-10 flex flex-col md:flex-row md:gap-y-5 xl:gap-y-7 md:gap-10 md:p-2 justify-center items-center">
            <div
                className="flex flex-row gap-4 xl:gap-10 py-2 px-4 items-center shadow-(--shadow-default) md:shadow-none">
                <LogoBlock/>
                <CatalogDropdown/>
                <SearchBlock/>
            </div>

            <nav aria-label="Основное меню" className="flex items-center gap-4">

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        АДМИН-ПАНЕЛЬ
                    </Link>
                )}

                <UserBlock/>
            </nav>
        </header>
    );
}

export default Header;