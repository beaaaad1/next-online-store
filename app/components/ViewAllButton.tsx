import Link from "next/link";

const ViewAllButton = ({btnText, href}: {btnText: string, href: string}) => {
    return (
        <Link href={href} className="flex flex-row items-center gap-x-2 cursor-pointer">
                        <p className="text-base text-center text-[#606060] hover:text-[#bfbfbf] duration-300">
                            {btnText}
                        </p>
                        <img src="/icons-header/shape.svg"
                             alt={btnText}
                             width={14}
                             height={14}
                             sizes="14px"/>
                    </Link>
    );
}

export default ViewAllButton;