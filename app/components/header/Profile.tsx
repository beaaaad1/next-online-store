const Profile = () => {
    return(
        <div className="ml-6 p-2 flex flex-1 justify-end items-center gap-2">
            <img src="/images/avatar.jpg" alt="ronaldo" width={40} height={40} className="min-w-10 min-h-10"/>
            <p className="hidden xl:block cursor-pointer p-2.5">Роналду</p>
            <button className="hidden xl:block cursor-pointer p-2"></button>
            <img src="/icons-header/arrow.svg" alt="arrow" width={24} height={24} sizes="24px"/>
        
        </div>);
};
export default Profile;