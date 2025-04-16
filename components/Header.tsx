import Link from "next/link";
import React, {MouseEventHandler} from "react";
import Logo from "@/app/icon.svg";
import UndoIcon from "@/public/undo.svg";
import {usePathname} from "next/navigation";

interface HeaderProps {
  shouldDisplayResetIcon: boolean;
  reset: MouseEventHandler<HTMLButtonElement> | undefined;
  isResetDisabled: boolean;
}

const Header: React.FC<HeaderProps> = ({shouldDisplayResetIcon, reset, isResetDisabled}) => {
  const pathname = usePathname();
  return (
    <header
      className={`${pathname === "/games" && "text-[#F0E6D2]"} header flex items-center justify-between sm:px-4 px-2 sm:text-lg text-sm  fixed top-0 w-full z-20 backdrop-blur-md sm:h-[4rem] h-[3.4rem]`}
    >
      <div className="">
        <Link href="/">
          <Logo/>
        </Link>
      </div>
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className={`flex justify-center flex-1 ${!shouldDisplayResetIcon ? "sm:mr-[2.5rem] mr-[2rem]" : ""}`}
      >
        <ul className="flex justify-center sm:space-x-6 space-x-3">
          <li>
            <a
              className="opacity-100 hover:opacity-80"
              onClick={() => alert("Coming soon")}
              aria-current={pathname === "/games" ? "page" : undefined}
            >
              Games
            </a>
          </li>
          <li>
            <Link href="/#about-me" aria-current={pathname === "/" ? "page" : undefined} className="opacity-100 hover:opacity-80">
              About
            </Link>
          </li>
          <li>
            <a  href="/resume" className="opacity-100 hover:opacity-80">Resume</a>
          </li>
        </ul>
      </nav>

      {shouldDisplayResetIcon && (
        <div className="ml-auto">
          <button onClick={reset} disabled={isResetDisabled}
                  className={`transition-opacity duration-300 ${isResetDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}
          >
            <UndoIcon/>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
