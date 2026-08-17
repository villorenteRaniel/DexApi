import React, {useEffect, useState} from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTop(){
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 80){
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return() => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"})
    }
    return(
        <button onClick={scrollToTop} className={`fixed z-50 bottom-10 right-10 xl:right-15 p-2.5 rounded-full bg-accent hover:bg-accent-hover text-white cursor-pointer ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <FaChevronUp size={10}/>
        </button>
    );
}