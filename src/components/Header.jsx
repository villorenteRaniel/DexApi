import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header(){
    return(
        <header className="fixed px-4 md:pl-20 lg:pl-68 top-0 right-0 left-0 h-16 z-10 bg-accent w-full flex items-center justify-between text-white">
            <GiHamburgerMenu />
        </header>
    );
}