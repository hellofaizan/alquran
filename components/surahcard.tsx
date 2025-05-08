"use client";

import React from "react";
import Link from "next/link";
import madinah from "../public/assets/madinah.png";
import makkah from "../public/assets/makkah.png";
import Image from "next/image";

interface Props {
  data: any;
  isActive?: boolean;
}

const SurahCard = ({ data, isActive }: Props) => {
  return (
    <Link
      href={`/surah/${data.number}`}
      className={`group border-[0.2px] p-4 py-5 flex justify-between items-center rounded-md ${
        isActive ? "border-[#22A5AD]" : "border-gray-500"
      } hover:border-[#22A5AD]`}
    >
      <div className="flex gap-1 items-center justify-center">
        <span
          className={`flex mr-2 w-9 group-hover:bg-[#22A5AD]/80 group-hover:font-bold h-9 rounded-lg text-center items-center justify-center rotate-45 ${
            isActive ? "bg-[#22A5AD]/80" : "bg-gray-800/30"
          }`}
        >
          <p className="-rotate-45 text-white font-light">{data.number}</p>
        </span>
        <div className="flex flex-col">
          <div className="flex gap-1 items-baseline">
            <p className="font-semibold text-lg">{data.name.arabeng}</p>
            <div title={data.revelation + " Surah"}>
              {relevationImage(data.revelation)}
            </div>
          </div>
          <p className="text-xs text-gray-400">{data.name.translation}</p>
        </div>
      </div>
      <div className="flex flex-col text-end">
        <p className="font-uthmanic text-base text-gray-200">
          {data.name.arab}
        </p>
        <p className="text-xs font-light text-gray-400">
          {data.verse_count} Aayahs
        </p>
      </div>
    </Link>
  );
};

const relevationImage = (revelation: string) => {
  if (revelation === "Meccan") {
    return (
      <Image
        src={makkah}
        alt="makkah"
        className="w-[13px] h-[13px] opacity-80"
        height={12}
        width={12}
      />
    );
  } else {
    return (
      <Image
        src={madinah}
        alt="madinah"
        className="w-4 h-4 opacity-80"
        height={14}
        width={14}
      />
    );
  }
};

export default SurahCard;
