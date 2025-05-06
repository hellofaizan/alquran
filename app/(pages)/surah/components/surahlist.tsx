import SurahCard from '@/components/surahcard';
import React, { useEffect, useState } from 'react'

export default function SurahList({ currentSurahNum }: { currentSurahNum: string }) {
    const [surahs, setSurahs] = useState<any[]>([]);
    const [search, setSearch] = useState('');
  
    useEffect(() => {
      const fetchSurahs = async () => {
        const res = await fetch('/api/surahlist');
        const result = await res.json();
        setSurahs(result.data.surahs || []);
      };
      fetchSurahs();
    }, []);
  
    const filteredSurahs = surahs.filter((s) =>
      s.name.arabeng.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation?.toLowerCase().includes(search.toLowerCase()) || s.number.toString().includes(search)
    );
  
    return (
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search Surah..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4 p-2 rounded bg-[#232323] text-white border border-gray-700 focus:outline-none focus:border-[#22A5AD] placeholder-gray-400"
        />
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.number}
              data={surah}
              isActive={String(surah.number) === String(currentSurahNum)}
            />
          ))}
        </div>
      </div>
    );
}
