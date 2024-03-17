"use client"

import React from 'react'
import { useState, useEffect } from "react"
import Aayahcard from '../components/aayahcard'


const SurahPage = ({ params }: { params: { surahnum: string } }) => {
  const [data, setData] = useState([])
  const [aayahList, setAayahList] = useState([])
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
        aayahList
          .map((item) => (
            <Aayahcard key={item} data={item} surahnum={surahnum} />
          ))
      }
    </div>
  )
}

export default SurahPage
