import { Separator } from '@/components/ui/separator'
import html2canvas from 'html2canvas'
import { BookOpen, FileImage, Play, Share2 } from 'lucide-react'
import React, { useRef } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'


interface Props {
    data: any,
    surahnum: string
}
const Aayahcard = ({ data, surahnum }: Props) => {
    const layoutRef = useRef(null);
    const shareAayah = () => {
        // convert the layout into an image and share that image
        if (layoutRef.current) {
            html2canvas(layoutRef.current, {
                backgroundColor: null,
                scale: 2
            }).then((canvas) => {
                const img = canvas.toDataURL('image/png')
                const link = document.createElement('a')
                link.href = img
                link.download = `aayah_${surahnum}_${data.number.inSurah}.png`
                link.click()
            })
        }

    }

    return (
        <div className='flex flex-col min-w-full' >
            {/* icons */}
            <div className='flex gap-2 justify-start items-start w-full py-2'>
                <p className='text-sm p-[5px] text-center hover:bg-slate-300/10 rounded-lg font-bold font-mono'>{surahnum}:{data.number.inSurah}</p>
                <Play className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={() => {
                    // play aayah audio from data.audio.primary
                    const audio = new Audio(data.audio.primary)
                    // if loadind show loading else show play icon
                    if (audio.readyState === 4) {
                        audio.play()
                    } else {
                        audio.oncanplay = () => {
                            audio.play()
                        }
                    }
                }} />
                <FileImage className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={() => {
                    // show aayat image from https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png
                    window.open(`https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png`)
                }} />
                <BookOpen className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
                <Share2 className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={shareAayah} />
                <FaEllipsisVertical className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
            </div>

            <div className='flex flex-col' ref={layoutRef}>
                {/* arabic aarah */}
                <div className='text-end py-2 items-center'><p className='text-3xl md:text-4xl font-uthmanic leading-loose'>{data.text.arab}<span className='text-lg font-light mr-2'>{data.number.inSurah}</span></p></div>

                {/* english translation */}
                <p className='text-base md:text-lg py-3 font-serif text-gray-200'>{data.translation.en}</p>
            </div>

            <Separator className='mt-3' />
        </div>
    )
}

export default Aayahcard
