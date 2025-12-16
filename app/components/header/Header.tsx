import LogoBlock from "@/app/components/header/LogoBlock";
import SearchBlock from "@/app/components/header/SearchBlock";
import CatalogDropdown from "@/app/components/header/CatalogDropdown";
import UserBlock from "@/app/components/header/UserBlock";

const Header = () => {
    return (
        <header className="bg-white w-full md:shadow-(--shadow-default) relative z-10 flex flex-col
         md:flex-row md:gap-y-5 xl:gap-y-7 md:gap-15 mp:p-2 justify-center">
         <div className="flex flex-row gap-4 xl:gap-y-10 py-2 px-4 items-center shadow-(--shadow-default) md:shadow-none">
             <LogoBlock/>

             <CatalogDropdown />

             <SearchBlock/>
         </div>

            <nav aria-label="Основное меню">
                <UserBlock/>
            </nav>
        </header>);
}
export default Header;