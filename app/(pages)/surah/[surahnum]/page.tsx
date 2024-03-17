"use client"

import React from 'react'
import { useState, useEffect } from "react"
import Aayahcard from '../components/aayahcard'
import { Skeleton } from '@/components/ui/skeleton'
import Player from '@/components/audioplayer'


const SurahPage = ({ params }: { params: { surahnum: string } }) => {
  const [data, setData] = useState<any>([])
  const [aayahList, setAayahList] = useState<any[]>([])
  const surahnum = params.surahnum

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {

    try {
      fetch("/api/surah/" + surahnum)
        .then((res) => res.json())
        .then((data) => {
          setData(data.data)
          setAayahList(data.data.verses)
        })
    } catch (err: any) {
      // toast({
      //   title: "Error",
      //   description: err.message,
      // })
    }
  }
  // const verses = data?.verses
  return (
    <div className='flex flex-col gap-3 mt-5 w-full items-center justify-center mb-2'>
      <p className='text-4xl md:text-5xl font-uthmanic'>{data.name?.long}</p>
      <p className='text-4xl md:text-5xl font-arabic mb-5'>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

      {
        aayahList.length > 0 ?
          (
            aayahList
              .map((item) => (
                <Aayahcard key={item} data={item} surahnum={surahnum} />
              ))
          ) : (
            <>
              <div className='flex flex-col gap-4 w-full'>
                <Skeleton className="w-1/2 h-8 rounded-md" />
                <Skeleton className="w-full h-20 rounded-md text-end" />
                <Skeleton className="w-10/12 h-12 rounded-md text-end" />
                <Skeleton className="w-full h-[2px] rounded-md text-end" />
                <Skeleton className="w-1/2 h-8 rounded-md" />
                <Skeleton className="w-full h-20 rounded-md text-end" />
                <Skeleton className="w-10/12 h-12 rounded-md text-end" />
              </div>
            </>
          )}

      <Player surah={surahnum} />
    </div>
  )
}

export default SurahPage
