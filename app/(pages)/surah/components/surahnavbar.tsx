import React from "react";
import { Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import appLogo from "@/public/assets/applogo-white.png";
import Link from "next/link";

export default function SurahNavbar({
  onSettingsToggle,
}: {
  onSettingsToggle?: () => void;
}) {
  return (
    <nav className="w-full flex items-center justify-between bg-[#232323] px-4 py-2 shadow-sm">
      {/* Left: Logo and Search */}
      <div className="flex items-center gap-4">
        {/* Logo/Icon */}
        <div className="flex gap-2 items-center">
          <Link href={"/"} className="flex items-center justify-center gap-2">
            <Image src={appLogo} className="w-10 h-10" alt="App Logo" />
            <p className="font-medium text-3xl font-serif md:flex hidden">
              Al Quran
            </p>
          </Link>
        </div>
      </div>

      {/* Bismilah text */}
      <p className="text-2xl md:text-3xl font-arabic h-full">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      {/* Right: User */}
      <div className="flex items-center gap-2 ml-4">
        <Toggle
          variant="default"
          size={"sm"}
          aria-label="Toggle settings"
          onClick={onSettingsToggle}
        >
          <Settings size={18} />
        </Toggle>
      </div>
    </nav>
  );
}
