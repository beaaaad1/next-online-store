import Link from "next/link";


const LogoBlock = () => {
    return (<Link href="/" className="flex flex-row gap-3 items-center cursor-pointer">
        <div className="relative">
            <img src="/icons-header/icon_logo.svg" alt="logo" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)" />
        </div>
    </Link>)
}
export default LogoBlock;