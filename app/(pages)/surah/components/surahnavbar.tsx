import React from "react";
import { Settings, Menu, MoreVertical } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import appLogo from "@/public/assets/applogo-white.png";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SurahList from "./surahlist";
import SettingPanel from "./settingspanel";

export default function SurahNavbar({
  onSettingsToggle,
  onLeftSidebarToggle,
  currentSurahNum,
  onSettingsChange,
}: {
  onSettingsToggle?: () => void;
  onLeftSidebarToggle?: () => void;
  currentSurahNum?: string;
  onSettingsChange?: (settings: any) => void;
}) {
  return (
    <nav className="w-full flex items-center justify-between bg-[#232323] px-4 py-2 shadow-sm">
      {/* Left: Logo and Menu */}
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
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      {/* Right: Settings */}
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Toggle
              variant="default"
              size={"xs"}
              aria-label="Toggle settings"
              className="md:hidden"
            >
              <Settings size={18} />
            </Toggle>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[#181818] border-l border-gray-700 p-4 h-full overflow-y-auto"
          >
            <div className="h-full overflow-y-auto">
              <SettingPanel onSettingsChange={onSettingsChange} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Menu Toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Toggle
              variant="default"
              size={"xs"}
              aria-label="Toggle menu"
              className="md:hidden"
            >
              <MoreVertical size={18} />
            </Toggle>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#181818] border-r border-gray-700 p-4 h-full overflow-y-auto"
          >
            <div className="h-full overflow-y-auto">
              {currentSurahNum && (
                <SurahList currentSurahNum={currentSurahNum} />
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Settings Toggle */}
        <Toggle
          variant="default"
          size={"sm"}
          aria-label="Toggle settings"
          onClick={onSettingsToggle}
          className="hidden md:flex"
        >
          <Settings size={18} />
        </Toggle>
      </div>
    </nav>
  );
}
