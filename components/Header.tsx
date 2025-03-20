import Link from "next/link";
import Image from "next/image";
import undo from "@/public/undo.svg";
import React from "react";
import logo from "@/app/icon.svg";
import { usePathname } from "next/navigation";

interface HeaderProps {
  shouldDisplayResetIcon: boolean;
}

const Header: React.FC<HeaderProps> = ({ shouldDisplayResetIcon }) => {
  const pathname = usePathname();

  return (
    <header className="header flex items-center justify-between sm:px-4 px-2 sm:text-lg text-sm  fixed top-0 w-full z-10 backdrop-blur-md sm:h-[4rem] h-[3.4rem]">
      <div className="">
        <Link href="/">
          <Image className="sm:w-full w-[2rem]" priority src={logo} alt="homepage" />
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
              onClick={() => alert("Coming soon")}
              aria-current={pathname === "/games" ? "page" : undefined}
            >
              Games
            </a>
          </li>
          <li>
            <Link href="/#about-me" aria-current={pathname === "/" ? "page" : undefined}>
              About
            </Link>
          </li>
          <li>
            <a href="/resume">Resume</a>
          </li>
        </ul>
      </nav>

      {shouldDisplayResetIcon && (
        <div className="ml-auto">
          <button className="image-button">
            <Image className="sm:w-full w-[2rem]" priority src={undo} alt="reset background" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
