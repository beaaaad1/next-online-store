const ButtonSearch = () => {
    return (
        <button className="bg-(--color-primary) hover:shadow-(--shadow-button-default)
           active:shadow-(--shadow-button-active) hidden md:flex w-10 lg:w-38 p-4 gap-9 cursor-pointer rounded duration-300">
               <img src="/icons-header/menu.svg" alt="menu"
                    width={40}
                    height={40}
                    className="hidden md:block" />
               <span className=" text-white hidden lg:block">Каталог</span>

       </button>
        
    );
}
export { ButtonSearch };