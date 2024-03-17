import { Separator } from '@/components/ui/separator'
import { BookOpen, FileImage, Play } from 'lucide-react'
import React from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'


interface Props {
    data: any,
    surahnum: string
}
const Aayahcard = ({ data, surahnum }: Props ) => {
    console.log(data)
    return (
        <div className='flex flex-col min-w-full'>
            {/* icons */}
            <div className='flex gap-2 justify-start items-start w-full py-2'>
                <p className='text-sm p-[5px] text-center hover:bg-slate-300/10 rounded-lg font-bold font-mono'>{surahnum}:{data.number.inSurah}</p>
                <Play className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={() => {
                    // play aayah audio from data.audio.primary
                    
                }} />
                <FileImage className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" onClick={() => {
                    // show aayat image from https://cdn.islamic.network/quran/images/${surahnum}_${data.number.inSurah}.png
                }}/>
                <BookOpen className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
                <FaEllipsisVertical className="w-7 h-7 p-[6px] hover:bg-slate-300/10 rounded-lg" />
            </div>
            {/* arabic aarah */}
            <div className='text-end py-2 items-center'><p className='text-3xl md:text-4xl font-uthmanic leading-loose'>{data.text.arab}<span className='text-lg font-light mr-2'>{data.number.inSurah}</span></p></div>
            {/* english translation */}
            <p className='text-base md:text-lg py-3 font-serif text-gray-200'>{data.translation.en}</p>

            <Separator className='mt-3'/>
        </div>
    )
}

export default Aayahcard
