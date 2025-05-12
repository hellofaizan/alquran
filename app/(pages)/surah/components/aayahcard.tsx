import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {
  BookOpen,
  Copy,
  FileImage,
  Pause,
  Play,
  Loader,
  Share2,
  ImagePlus,
} from "lucide-react";
import React, { useRef, useEffect } from "react";
import { toast } from "sonner";

// Global state for currently playing ayah
let currentlyPlayingAyah: { surah: string; ayah: number } | null = null;
const ayahAudioElements: { [key: string]: HTMLAudioElement } = {};
const ayahPlayStates: { [key: string]: (isPlaying: boolean) => void } = {};

interface Props {
  data: any;
  surahnum: string;
  translationSettings?: {
    showEnglish: boolean;
    showUrdu: boolean;
    fontSizeArabic?: number;
    fontSizeEnglish?: number;
    fontSizeUrdu?: number;
    arabicFont?: string;
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
  const [aayahImageLoading, setAayahImageLoading] = React.useState(false);
  const [aayahPlaying, setAayahPlaying] = React.useState(false);
  const audioPlayer = useRef<any>(null);
  const ayahKey = `${surahnum}_${data.number.inSurah}`;

  // Effect to handle audio element cleanup
  useEffect(() => {
    if (audioPlayer.current) {
      ayahAudioElements[ayahKey] = audioPlayer.current;
      ayahPlayStates[ayahKey] = setAayahPlaying;
    }

    return () => {
      delete ayahAudioElements[ayahKey];
      delete ayahPlayStates[ayahKey];
    };
  }, [ayahKey]);

  // Share aayah with image
  const shareAayah = async () => {
    setAayahImageLoading(true);
    try {
      const payload = {
        arabic: data.text.arab,
        translation: data.text.translation,
        surah: surahnum,
        ayah: data.number.inSurah,
        lang:
          !translationSettings || translationSettings.showEnglish ? "en" : "ur",
      };
      const res = await fetch("/api/aayahImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to generate image");
      const blob = await res.blob();
      const file = new File(
        [blob],
        `ayah_${surahnum}_${data.number.inSurah}.png`,
        { type: "image/png" }
      );
      const text = `${data.text.arab} -- ${data.text.translation} -- https://alquran.mohammadfaizan.in/surah/${surahnum}/${data.number.inSurah}`;
      const shareData: any = {
        title: "Quran Aayah",
        text: text,
        files: [file],
      };
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        // fallback: just share text
        await navigator.share({ title: "Quran Aayah", text });
      }
    } catch (err) {
      toast.error("Failed to share aayah image");
    } finally {
      setAayahImageLoading(false);
    }
  };

  const stopAllOtherAyahs = () => {
    Object.entries(ayahAudioElements).forEach(([key, audio]) => {
      if (key !== ayahKey) {
        audio.pause();
        audio.currentTime = 0;
        // Update the UI state of other ayahs
        if (ayahPlayStates[key]) {
          ayahPlayStates[key](false);
        }
      }
    });
  };

  const togglePlayPause = () => {
    const prevValue = aayahPlaying;

    // If this ayah is already playing, just pause it
    if (prevValue) {
      setAayahPlaying(false);
      audioPlayer?.current.pause();
      currentlyPlayingAyah = null;
      return;
    }

    // Stop all other playing ayahs
    stopAllOtherAyahs();

    // Start playing this ayah
    setAayahPlaying(true);
    currentlyPlayingAyah = { surah: surahnum, ayah: data.number.inSurah };

    // Reset and play
    if (audioPlayer?.current) {
      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play();
    }

    // Add ended event listener
    audioPlayer?.current.addEventListener("ended", () => {
      setAayahPlaying(false);
      currentlyPlayingAyah = null;
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

  // Get the font class based on settings
  const getArabicFontClass = () => {
    const fontType = translationSettings?.arabicFont || "uthmanic";
    switch (fontType) {
      case "uthmanic":
        return "font-uthmanic";
      case "arabic":
        return "font-arabic";
      case "indopak":
        return "font-indopak";
      default:
        return "font-uthmanic";
    }
  };

  return (
    <div className="flex flex-row py-2">
      {/* icons */}
      <div className="flex-col gap-1 items-center px-2 h-max hidden md:flex">
        <p className="text-sm px-2 py-1 text-center bg-slate-300/10 rounded-md font-bold font-mono">
          {surahnum}:{data.number.inSurah}
        </p>
        <button
          className="bg-center"
          title="Play/Pause"
          onClick={togglePlayPause}
        >
          <audio ref={audioPlayer} src={data.audio} preload="metadata"></audio>
          {aayahLoading ? (
            <Loader className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg animate-spin" />
          ) : aayahPlaying ? (
            <Pause className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
          ) : (
            <Play className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
          )}
        </button>
        {aayahImageLoading ? (
          <Loader className="w-7 h-7 p-[6px] animate-spin text-slate-400" />
        ) : (
          <Share2
            className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg cursor-pointer"
            onClick={shareAayah}
          />
        )}
      </div>

      <div className="flex flex-col w-full py-1 md:py-2 md:pt-4">
        {/* Small Screen Icons */}
        <div className="flex gap-1 items-center px-2 h-max md:hidden">
          <p className="text-sm px-2 py-1 text-center bg-slate-300/10 rounded-md font-bold font-mono">
            {surahnum}:{data.number.inSurah}
          </p>
          <button
            className="bg-center"
            title="Play/Pause"
            onClick={togglePlayPause}
          >
            <audio
              ref={audioPlayer}
              src={data.audio}
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
          {aayahImageLoading ? (
            <Loader className="w-7 h-7 p-[6px] animate-spin text-slate-400" />
          ) : (
            <Share2
              className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg cursor-pointer"
              onClick={shareAayah}
            />
          )}
        </div>

        <div className="flex flex-col gap-1" ref={layoutRef}>
          {/* arabic aayah */}
          <div className="text-end items-center">
            <p
              className={`${getArabicFontClass()} py-1 md:py-2 leading-relaxed ${fontArabic}`}
            >
              {data.text.arab}
            </p>
          </div>

          {/* Urdu Translation */}
          {translationSettings && translationSettings.showUrdu && (
            <div className="text-end items-center">
              <p className={`font-uthmanic text-gray-200 ${fontUrdu}`}>
                {data.text.urdu} {"۔"}
              </p>
            </div>
          )}

          {/* english translation */}
          {(!translationSettings || translationSettings.showEnglish) && (
            <p
              className={`pb-2 md:pt-2 font-mono text-gray-200 ${fontEnglish}`}
            >
              {data.text.translation}
            </p>
          )}
        </div>

        <Separator className="mt-3" />
      </div>
    </div>
  );
};

export default Aayahcard;
