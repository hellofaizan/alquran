"use client"

import React from 'react'
import Link from 'next/link'

interface Props {
    data: any
}

const SurahCard = ({ data }: Props) => {
    return (
        <Link href={`/surah/${data.number}`} className='border-gray-500 border-[0.2px] p-4 py-5 hover:border-[#22A5AD] flex justify-between items-center rounded-md'>
            <div className='flex gap-2 items-center justify-center'>
                <span className='flex mr-2 -z-10 bg-gray-800/30 w-10 h-10 rounded-lg text-center items-center justify-center rotate-45'><p className='-rotate-45 text-white'>{data.number}</p></span>
                <div className='flex flex-col'>
                    <p className='font-semibold text-lg'>{data.englishName}</p>
                    <p className='text-xs text-gray-400'>{data.englishNameTranslation}</p>
                </div>
            </div>
            <div className='flex flex-col text-end'>
                <p className='font-uthmanic text-base text-gray-200'>{data.name}</p>
                <p className='text-xs text-gray-400'>{data.numberOfAyahs} Aayahs</p>
            </div>
        </Link>
    )
}

export default SurahCard