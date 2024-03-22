"use client"

import React, { useState, useEffect } from "react";
import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import appLogo from "@/public/assets/applogo-white.png";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
const Nav = () => {
    const [scrolling, setScrolling] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0); // Set initial width to 0

    useEffect(() => {
        // Check if window is defined before accessing window.innerWidth
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }

        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolling(isScrolled);
        };

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Check if window is defined before adding event listeners
        if (typeof window !== 'undefined') {
            window.addEventListener("scroll", handleScroll);
            window.addEventListener("resize", handleResize);
        }

        return () => {
            // Check if window is defined before removing event listeners
            if (typeof window !== 'undefined') {
                window.removeEventListener("scroll", handleScroll);
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    const githubLink = () => {
        window.open("https://github.com/hellofaizan/alquran", "_blank");
    }
    const donoLink = () => {
        window.open("https://www.buymeacoffee.com/hellofaizan", "_blank");
    }

    return (
        <div className={cn(
            "sticky top-0 w-full justify-center px-4 z-10",
            scrolling
                ? "backdrop-blur-lg"
                : "backdrop-blur-0"
        )}>
            <div className="flex justify-between flex-row py-5">
                {/* Menu and Logo */}
                <div className="flex gap-2 items-center">
                    <Link href={"/"} className="flex items-center justify-center gap-2">
                        <Image src={appLogo} className="w-10 h-10" alt="App Logo" />
                        <p className="font-medium text-3xl font-serif">Al Quran</p>
                    </Link>
                </div>

                {/* Icons End */}
                <div className="flex items-center gap-1">
                    <Link href="">
                        <GitHubLogoIcon className="w-9 h-9 p-[7px] hover:bg-slate-300/10 rounded-lg" onClick={githubLink}/>
                    </Link>
                    <Link href="">
                        <Heart className="w-9 h-9 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={donoLink} />
                    </Link>
                    <Sheet>
                        <SheetTrigger>
                            <Menu className="w-9 h-9 p-[5px] hover:bg-slate-300/10 rounded-lg" />
                        </SheetTrigger>
                        <SheetContent>
                                
                            <SheetFooter>
                                <p className="text-center">© 2024 Al Quran</p>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default Nav;