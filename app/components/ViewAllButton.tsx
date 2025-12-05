import Link from "next/link";

const ViewAllButton = ({btnText, href}: {btnText: string, href: string}) => {
    return (
        <Link href={href} className="flex flex-row items-center gap-x-2 cursor-pointer">
                        <p className="text-base text-center text-[#606060] hover:text-[#bfbfbf] duration-300">
                            {btnText}
                        </p>
                        <img src="/icons-header/shape.svg"
                             alt={btnText}
                             width={24}
                             height={24}
                             sizes="24px"/>
                    </Link>
    );
}

export default ViewAllButton;