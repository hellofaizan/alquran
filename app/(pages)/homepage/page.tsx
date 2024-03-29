"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { FaArrowUp91, FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, X } from "lucide-react";
import SurahCard from '@/components/surahcard';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const HomePage = () => {
    const { toast } = useToast()
    const [listSurah, setListSurah] = useState<any>([])
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState("acc")

    const [continueSurah, setContinueSurah] = useState<any>()

    useEffect(() => {
        fetchData()
        fetchContinueSurah()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort])

    const fetchData = async () => {
        try {
            fetch("/api/surahlist")
                .then((res) => res.json())
                .then((data) => {
                    sortData(data.data)
                })
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
            })
        }
    }

    const sortData = (data: any) => {
        if (sort === "acc") {
            setListSurah(data.sort((a: any, b: any) => a.number - b.number))
        } else if (sort === "dec") {
            setListSurah(data.sort((a: any, b: any) => b.number - a.number))
        } else if (sort === "accaaya") {
            setListSurah(data.sort((a: any, b: any) => a.numberOfAyahs - b.numberOfAyahs))
        } else if (sort === "decaaya") {
            setListSurah(data.sort((a: any, b: any) => b.numberOfAyahs - a.numberOfAyahs))
        }
    }

    const fetchContinueSurah = () => {
        const continueSurahData = localStorage.getItem('continueSurah')
        if (continueSurahData) {
            setContinueSurah(JSON.parse(continueSurahData))
        }
    }

    return (
        <main className="w-full flex items-center justify-center">
            <div className="w-full items-center mt-5 mb-5">

                {continueSurah && (
                    <Link href={`/surah/${continueSurah.number}`} className="flex items-center gap-2 p-2 bg-slate-300/10 rounded-md mb-5">
                        <p className="text-sm font-semibold">Continue Reading</p>
                        <p className="text-sm font-light">{continueSurah.name} - {continueSurah.enName}</p>
                    </Link>
                )}

                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-semibold">List Surah</h1>
                    {/* Sort By dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <p className="flex items-center gap-1 cursor-pointer px-2 py-[4px] border rounded-md text-sm">Sort By <FaArrowUp91 /></p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                                <DropdownMenuRadioItem value="acc">Accending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="dec">Decending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="accaaya">Lowest Aayah</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="decaaya">Maximum Aayah</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div>
                    <div className="relative mt-4">

                        <Input
                            type="text"
                            id="Search"
                            name="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Surah Number, Name..."
                            className="w-full rounded-md border py-3 pe-10 px-2 shadow-sm sm:text-sm"
                        />

                        {
                            search.length > 0 ? (
                                <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                    <button type="button" onClick={() => {
                                        setSearch("")
                                    }}>
                                        <X />
                                    </button>
                                </span>
                            ) : (
                                <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                    <button type="button">
                                        <Search />
                                    </button>
                                </span>

                            )}
                    </div>
                </div>
                {/* // if large screen 3 grid else 1 grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-5">
                    {listSurah.length > 0 ? (
                        listSurah
                            .filter((item: any) => {
                                if (search === "") {
                                    return item
                                } else if (item.number.toString().includes(search)) {
                                    return item
                                } else if (item.englishName.toLowerCase().includes(search.toLowerCase())) {
                                    return item
                                } else if (item.englishNameTranslation.toLowerCase().includes(search.toLowerCase())) {
                                    return item
                                }
                            })
                            .map((item: any) => (
                                <SurahCard key={item.number} data={item} />
                            ))
                    ) : (
                        <>
                            <Skeleton className="w-full h-20 rounded-md" />
                            <Skeleton className="w-full h-20 rounded-md" />
                            <Skeleton className="w-full h-20 rounded-md" />
                            <Skeleton className="w-full h-20 rounded-md" />
                            <Skeleton className="w-full h-20 rounded-md" />
                            <Skeleton className="w-full h-20 rounded-md" />
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

export default HomePage