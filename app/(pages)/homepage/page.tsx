"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FaArrowUp91, FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X } from "lucide-react";
import SurahCard from "@/components/surahcard";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Nav from "@/components/navbar";

const HomePage = () => {
  const { toast } = useToast();
  const [listSurah, setListSurah] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("acc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<any>(null);

  const [continueSurah, setContinueSurah] = useState<any>();
  const [hasNextPage, setHasNextPage] = useState(true);

  const lastSurahElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchData(currentPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, currentPage, hasNextPage]
  );

  useEffect(() => {
    setListSurah([]);
    setCurrentPage(1);
    setHasNextPage(true);
    fetchData(1);
    fetchContinueSurah();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/surahlist?page=${page}`);
      const data = await res.json();
      setCurrentPage(data.data.pagination.currentPage);
      setHasNextPage(data.data.pagination.hasNextPage);
      if (page === 1) {
        sortData(data.data.surahs, true);
      } else {
        sortData([...listSurah, ...data.data.surahs], false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
      });
    }
    setLoading(false);
  };

  const sortData = (data: any, reset = false) => {
    let sorted = data;
    if (sort === "acc") {
      sorted = data.sort((a: any, b: any) => a.number - b.number);
    } else if (sort === "dec") {
      sorted = data.sort((a: any, b: any) => b.number - a.number);
    } else if (sort === "accaaya") {
      sorted = data.sort((a: any, b: any) => a.verse_count - b.verse_count);
    } else if (sort === "decaaya") {
      sorted = data.sort((a: any, b: any) => b.verse_count - a.verse_count);
    }
    if (reset) {
      setListSurah(sorted);
    } else {
      setListSurah(sorted);
    }
  };

  const fetchContinueSurah = () => {
    const continueSurahData = localStorage.getItem("continueSurah");
    if (continueSurahData) {
      setContinueSurah(JSON.parse(continueSurahData));
    }
  };

  return (
    <main className="w-full flex items-center flex-auto min-w-0 flex-col container max-w-3xl mx-auto min-h-screen md:pt-16 px-0">
      <Nav />
      <div className="w-full items-center mt-5 mb-5 px-3 md:px-0">
        {continueSurah && (
          <Link
            href={`/surah/${continueSurah.number}#${continueSurah.lastAayah}`}
            className="flex items-center gap-2 p-2 bg-slate-300/10 rounded-md mb-5"
          >
            <p className="text-sm font-semibold">Continue</p>
            <p className="text-sm font-light">
              {continueSurah.enName} - {continueSurah.name}
            </p>
          </Link>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold">List Surah</h1>
          {/* Sort By dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="flex items-center gap-1 cursor-pointer px-2 py-[4px] border rounded-md text-sm">
                Sort By <FaArrowUp91 />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="acc">
                  Accending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dec">
                  Decending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="accaaya">
                  Lowest Aayah
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="decaaya">
                  Maximum Aayah
                </DropdownMenuRadioItem>
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

            {search.length > 0 ? (
              <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                  }}
                >
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
                  return item;
                } else if (item.number.toString().includes(search)) {
                  return item;
                } else if (
                  item.name?.arabeng?.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                } else if (
                  item.name?.translation?.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map((item: any, idx: number) => {
                const isActive = continueSurah && String(item.number) === String(continueSurah.number);
                if (idx === listSurah.length - 1) {
                  return (
                    <div ref={lastSurahElementRef} key={item.number}>
                      <SurahCard data={item} isActive={isActive} />
                    </div>
                  );
                } else {
                  return <SurahCard key={item.number} data={item} isActive={isActive} />;
                }
              })
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
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
            <Skeleton className="w-full h-20 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
