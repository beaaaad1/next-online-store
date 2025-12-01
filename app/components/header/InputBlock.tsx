const InputBlock = () => {
    return (
        <div className=" relative min-w-[261px] flex-grow">
               <input type="text"
                placeholder="Найти товар"
                className="w-full h-14 rounded p-2 outline
               outline-(--color-primary) focus:outline-(--shadow-button-default) text-[#8f8f8f] text-base leading-[150%]" />
               <button className="absolute top-4 right-2 cursor-pointer">
                   <img src="/icons-header/search.svg" alt="Поиск"/>
               </button>
           </div>
    );
}
export default InputBlock;