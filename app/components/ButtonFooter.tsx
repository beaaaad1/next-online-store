import Link from "next/link";

const ButtonFooter = ({btnText, href}: {btnText: string, href: string}) => {
    return (
        <Link href={href} className="flex flex-row items-center gap-x-2 cursor-pointer">
                        <p className="text-base text-center text-[#fff] hover:text-[#bfbfbf] duration-300">
                            {btnText}
                        </p>

                    </Link>
    );
}

export default ButtonFooter;