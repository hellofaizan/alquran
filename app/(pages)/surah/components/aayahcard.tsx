import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import html2canvas from 'html2canvas'
import { BookOpen, Copy, FileImage, Pause, Play, Share2 } from 'lucide-react'
import React, { useRef } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'


interface Props {
    data: any,
    surahnum: string
}
const Aayahcard = ({ data, surahnum }: Props) => {
    const layoutRef = useRef(null);
    const [urTranslation, setUrTranslation] = React.useState('')
    const [aayahLoading, setAayahLoading] = React.useState(false)
    const [aayahPlaying, setAayahPlaying] = React.useState(false)

    const aayahnum = data.number.inSurah

    const getUrdutranslation = async () => {
        const urdu_tr = await axios.get(`/api/surah/ur_translation/${surahnum}/${aayahnum}`).then((res) => {
            return res.data.text
        })
        setUrTranslation(urdu_tr)
        return urdu_tr
    }

    getUrdutranslation()

    const shareAayah = () => {
        const text = `${data.text.arab} -- ${urTranslation}`
        const shareData = {
            title: 'Quran Aayah',
            text: text,
        }
        navigator.share(shareData)
    }

    return (
        <div className='flex flex-col min-w-full' >
            {/* icons */}
            <div className='flex gap-2 justify-start items-start w-full py-2'>
                <p className='text-sm p-[5px] text-center hover:bg-slate-300/10 rounded-lg font-bold font-mono'>{surahnum}:{data.number.inSurah}</p>
                <button className='bg-center' onClick={() => {
                    // play aayah audio from data.audio.primary
                    const audio = new Audio(data.audio.primary)
                    // if loadind show loading else show play icon
                    setAayahLoading(true)
                    if (audio.readyState === 4) {
                        setAayahLoading(false)
                        setAayahPlaying(true)
                        audio.play()
                    } else {
                        audio.oncanplay = () => {
                            setAayahLoading(false)
                            setAayahPlaying(true)
                            audio.play()
                        }
                    }
                    audio.onended = () => {
                        setAayahLoading(false)
                        setAayahPlaying(false)
                    }
                }}>
                    {aayahLoading ? (
                        <svg className="w-7 h-7 text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                        <path
                          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                          stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path
                          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                          stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
                        </path>
                      </svg>
                    ) : aayahPlaying ? <Pause className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" /> : <Play className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />}
                </button>
                <FileImage className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={() => {
                    // show aayat image from https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png
                    window.open(`https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png`)
                }} />
                <BookOpen className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
                <Copy className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={shareAayah} />
                <FaEllipsisVertical className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
            </div>

            <div className='flex flex-col' ref={layoutRef}>
                {/* arabic aarah */}
                <div className='text-end py-1 items-center'><p className='text-3xl md:text-4xl font-uthmanic leading-relaxed'>{data.text.arab}<span className='text-lg font-light mr-2'>{data.number.inSurah}</span></p></div>

                {/* english translation */}
                <p className='text-base md:text-lg pb-2 md:pt-2 font-mono text-gray-200'><span className='text-xs text-gray-500 font-mono'>EN:</span>{data.translation.en}</p>

                {/* Urdu Translation */}
                <div className='text-end py-1 mb-2 items-center'><p className='text-lg md:text-xl font-uthmanic text-gray-200'>{urTranslation}<span className='text-xs text-gray-500 font-mono'>:UR</span></p></div>
            </div>

            <Separator className='mt-3' />
        </div>
    )
}

export default Aayahcard
