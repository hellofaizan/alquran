"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Aayahcard from "../components/aayahcard";
import { Skeleton } from "@/components/ui/skeleton";
import Player from "@/components/audioplayer";

const SurahPage = ({ params }: { params: { surahnum: string } }) => {
  // TODO: In future Next.js versions, unwrap params with React.use(params)
  const surahnum = params.surahnum;
  const [data, setData] = useState<any>({});
  const [aayahList, setAayahList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<any>(null);

  const lastAayahElementRef = useCallback(
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
    setAayahList([]);
    setCurrentPage(1);
    setHasNextPage(true);
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahnum]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/surah/${surahnum}?page=${page}&limit=10`);
      const result = await res.json();
      if (page === 1) {
        setData(result.data);
        setAayahList(result.data.verses);
      } else {
        setAayahList((prev: any[]) => [...prev, ...result.data.verses]);
      }
      setCurrentPage(result.data.pagination.currentPage);
      setHasNextPage(result.data.pagination.hasNextPage);
    } catch (err: any) {
      // handle error if needed
    }
    setLoading(false);
  };

  const surahName = data.name?.arab;
  const surahTranslation = data.name?.translation;

  if (data) {
    const surahInfo = {
      name: surahName,
      number: surahnum,
      verses: data.verse_count,
      enName: surahTranslation,
    };
    // continue reading feature
    // localStorage.setItem("continueSurah", JSON.stringify(surahInfo));
  }

  return (
    <div className="flex flex-col gap-3 mt-5 w-full items-center justify-center mb-2">
      <p className="text-4xl md:text-5xl font-uthmanic">{surahName}</p>
      <p className="text-lg md:text-xl font-mono mb-2">{surahTranslation}</p>
      <p className="text-4xl md:text-5xl font-arabic mb-5">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      <div className="mb-14 w-full">
        {aayahList.length > 0 ? (
          aayahList.map((item, idx) => {
            if (idx === aayahList.length - 1) {
              return (
                <div ref={lastAayahElementRef} key={item.number.inQuran}>
                  <Aayahcard data={item} surahnum={surahnum} />
                </div>
              );
            } else {
              return <Aayahcard key={item.number.inQuran} data={item} surahnum={surahnum} />;
            }
          })
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
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
      </div>
      {loading && (
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="w-1/2 h-8 rounded-md" />
          <Skeleton className="w-full h-20 rounded-md text-end" />
        </div>
      )}
      <Player surah={surahnum} />
    </div>
  );
};

export default SurahPage;
