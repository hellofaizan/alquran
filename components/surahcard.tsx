"use client";

import React from "react";
import Link from "next/link";

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
      <div className="flex gap-2 items-center justify-center">
        <span
          className={`flex mr-2 -z-10 w-10 group-hover:bg-[#22A5AD] group-hover:font-bold h-10 rounded-lg text-center items-center justify-center rotate-45 ${
            isActive ? "bg-[#22A5AD]" : "bg-gray-800/30"
          }`}
        >
          <p className="-rotate-45 text-white font-light">{data.number}</p>
        </span>
        <div className="flex flex-col">
          <p className="font-semibold text-lg">{data.name.arabeng}</p>
          <p className="text-xs text-gray-400">{data.englishNameTranslation}</p>
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

export default SurahCard;
