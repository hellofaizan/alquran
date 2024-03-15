import React from "react";
import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import appLogo from "@/public/assets/applogo-white.png";

const Nav = () => {
    return (
        <div className="sticky top-0 backdrop-blur-lg w-full justify-center">
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
                        <GitHubLogoIcon className="w-8 h-8 p-1.5 hover:bg-slate-300/10 rounded-lg" />
                    </Link>
                    <Link href="">
                        <Heart className="w-8 h-8 p-1.5 hover:bg-slate-300/10 rounded-lg" />
                    </Link>
                    <Menu className="w-8 h-8 p-1.5 hover:bg-slate-300/10 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default Nav;