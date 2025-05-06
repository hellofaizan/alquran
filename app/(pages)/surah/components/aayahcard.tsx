import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { BookOpen, Copy, FileImage, Pause, Play, Loader } from "lucide-react";
import React, { useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface Props {
  data: any;
  surahnum: string;
  translationSettings?: {
    showEnglish: boolean;
    showUrdu: boolean;
    fontSizeArabic?: number;
    fontSizeEnglish?: number;
    fontSizeUrdu?: number;
  };
  fontSizeArabic?: number;
  fontSizeEnglish?: number;
  fontSizeUrdu?: number;
}
const fontSizeMap = {
  1: {
    arabic: "text-xl md:text-2xl",
    english: "text-sm md:text-base",
    urdu: "text-base md:text-lg",
  },
  2: {
    arabic: "text-2xl md:text-3xl",
    english: "text-base md:text-lg",
    urdu: "text-lg md:text-xl",
  },
  3: {
    arabic: "text-3xl md:text-4xl",
    english: "text-lg md:text-xl",
    urdu: "text-xl md:text-2xl",
  },
  4: {
    arabic: "text-4xl md:text-5xl",
    english: "text-xl md:text-2xl",
    urdu: "text-2xl md:text-3xl",
  },
  5: {
    arabic: "text-5xl md:text-6xl",
    english: "text-2xl md:text-3xl",
    urdu: "text-3xl md:text-4xl",
  },
};
const Aayahcard = ({
  data,
  surahnum,
  translationSettings,
  fontSizeArabic,
  fontSizeEnglish,
  fontSizeUrdu,
}: Props) => {
  const layoutRef = useRef(null);
  const [aayahLoading, setAayahLoading] = React.useState(false);
  const [aayahPlaying, setAayahPlaying] = React.useState(false);
  const audioPlayer = useRef<any>(null);

  const shareAayah = () => {
    const text = `${data.text.arab} -- ${data.text.translation}`;
    const shareData = {
      title: "Quran Aayah",
      text: text,
    };
    navigator.share(shareData);
  };

  const togglePlayPause = () => {
    const prevValue = aayahPlaying;
    setAayahPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer?.current.play();
    } else {
      audioPlayer?.current.pause();
    }

    audioPlayer?.current.addEventListener("ended", () => {
      setAayahPlaying(false);
    });
  };

  // Use font sizes from props or translationSettings, or default to 3
  const sizeArabic = fontSizeArabic || translationSettings?.fontSizeArabic || 3;
  const sizeEnglish =
    fontSizeEnglish || translationSettings?.fontSizeEnglish || 3;
  const sizeUrdu = fontSizeUrdu || translationSettings?.fontSizeUrdu || 3;
  const fontArabic =
    fontSizeMap[sizeArabic as 1 | 2 | 3 | 4 | 5]?.arabic ||
    fontSizeMap[3].arabic;
  const fontEnglish =
    fontSizeMap[sizeEnglish as 1 | 2 | 3 | 4 | 5]?.english ||
    fontSizeMap[3].english;
  const fontUrdu =
    fontSizeMap[sizeUrdu as 1 | 2 | 3 | 4 | 5]?.urdu || fontSizeMap[3].urdu;

  return (
    <div className="flex flex-col min-w-full">
      {/* icons */}
      <div className="flex gap-2 justify-start items-start w-full py-2">
        <p className="text-sm p-[5px] text-center hover:bg-slate-300/10 rounded-lg font-bold font-mono">
          {surahnum}:{data.number.inSurah}
        </p>
        <button className="bg-center" onClick={togglePlayPause}>
          <audio
            ref={audioPlayer}
            src={data.audio.primary}
            preload="metadata"
          ></audio>
          {aayahLoading ? (
            <Loader className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg animate-spin" />
          ) : aayahPlaying ? (
            <Pause className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
          ) : (
            <Play className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
          )}
        </button>
        <FileImage
          className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg"
          onClick={() => {
            // show aayat image from https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png
            window.open(
              `https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png`
            );
          }}
        />
        <BookOpen className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
        <Copy
          className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg"
          onClick={shareAayah}
        />
        <FaEllipsisVertical className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
      </div>

      <div className="flex flex-col gap-2" ref={layoutRef}>
        {/* arabic aayah */}
        <div className="text-end py-1 items-center">
          <p className={`font-uthmanic leading-relaxed ${fontArabic}`}>
            {data.text.arab}
          </p>
        </div>

        {/* Urdu Translation */}
        {translationSettings && translationSettings.showUrdu && (
          <div className="text-end py-1 mb-2 items-center">
            <p className={`font-uthmanic text-gray-200 ${fontUrdu}`}>
              {data.text.urdu} {"۔"}
            </p>
          </div>
        )}

        {/* english translation */}
        {(!translationSettings || translationSettings.showEnglish) && (
          <p className={`pb-2 md:pt-2 font-mono text-gray-200 ${fontEnglish}`}>
            {data.text.translation}
          </p>
        )}
      </div>

      <Separator className="mt-3" />
    </div>
  );
};

export default Aayahcard;
