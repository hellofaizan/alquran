import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { BookOpen, Copy, FileImage, Pause, Play, Loader } from "lucide-react";
import React, { useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface Props {
  data: any;
  surahnum: string;
}
const Aayahcard = ({ data, surahnum }: Props) => {
  const layoutRef = useRef(null);
  const [urTranslation, setUrTranslation] = React.useState("");
  const [aayahLoading, setAayahLoading] = React.useState(false);
  const [aayahPlaying, setAayahPlaying] = React.useState(false);
  const audioPlayer = useRef<any>(null);

  const aayahnum = data.number.inSurah;

  const getUrdutranslation = async () => {
    const urdu_tr = await axios
      .get(`/api/surah/ur_translation/${surahnum}/${aayahnum}`)
      .then((res) => {
        return res.data.text;
      });
    setUrTranslation(urdu_tr);
    return urdu_tr;
  };

  getUrdutranslation();

  const shareAayah = () => {
    const text = `${data.text.arab} -- ${urTranslation}`;
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

      <div className="flex flex-col" ref={layoutRef}>
        {/* arabic aarah */}
        <div className="text-end py-1 items-center">
          <p className="text-3xl md:text-4xl font-uthmanic leading-relaxed">
            {data.text.arab}
            <span className="text-lg font-light mr-2">
              {data.number.inSurah}
            </span>
          </p>
        </div>

        {/* english translation */}
        <p className="text-base md:text-lg pb-2 md:pt-2 font-mono text-gray-200">
          <span className="text-xs text-gray-500 font-mono">EN:</span>
          {data.translation.en}
        </p>

        {/* Urdu Translation */}
        <div className="text-end py-1 mb-2 items-center">
          <p className="text-lg md:text-xl font-uthmanic text-gray-200">
            {urTranslation}
            <span className="text-xs text-gray-500 font-mono">:UR</span>
          </p>
        </div>
      </div>

      <Separator className="mt-3" />
    </div>
  );
};

export default Aayahcard;
