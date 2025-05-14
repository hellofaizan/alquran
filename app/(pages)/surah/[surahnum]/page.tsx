"use client";

import React, { useState, useEffect, useRef, useCallback, use } from "react";
import Aayahcard from "../components/aayahcard";
import { Skeleton } from "@/components/ui/skeleton";
import Player from "@/components/audioplayer";
import SurahList from "../components/surahlist";
import SettingPanel from "../components/settingspanel";
import SurahNavbar from "../components/surahnavbar";

function getInitialTranslationSettings() {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("alquran_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        showEnglish: parsed.showEnglish ?? true,
        showUrdu: parsed.showUrdu ?? false,
        fontSizeArabic: parsed.fontSizeArabic ?? 3,
        fontSizeEnglish: parsed.fontSizeEnglish ?? 3,
        fontSizeUrdu: parsed.fontSizeUrdu ?? 3,
      };
    }
  }
  return {
    showEnglish: true,
    showUrdu: false,
    fontSizeArabic: 3,
    fontSizeEnglish: 3,
    fontSizeUrdu: 3,
  };
}

// --- Streak/session timer logic ---
function getTodayDateStr() {
  const now = new Date();
  // Format date in YYYY-MM-DD using local timezone
  return now.toLocaleDateString('en-CA'); // This will use local timezone and format as YYYY-MM-DD
}

const SurahPage = (props: { params: Promise<{ surahnum: string }> }) => {
  const params = use(props.params);
  const surahnum = params.surahnum;
  const [data, setData] = useState<any>({});
  const [aayahList, setAayahList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<any>(null);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [translationSettings, setTranslationSettings] = useState(
    getInitialTranslationSettings
  );

  const currentPageRef = useRef(currentPage);
  const hasNextPageRef = useRef(hasNextPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
    hasNextPageRef.current = hasNextPage;
  }, [currentPage, hasNextPage]);

  const lastAayahElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPageRef.current) {
          fetchData(currentPageRef.current + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
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
    localStorage.setItem("continueSurah", JSON.stringify(surahInfo));
  }

  // Handler for settings toggle
  const handleSettingsToggle = () => setShowRightSidebar((v) => !v);
  // Handler for left sidebar (if you want to add a button for it later)
  const handleLeftSidebarToggle = () => setShowLeftSidebar((v) => !v);

  // Handler for translation settings change
  const handleSettingsChange = (settings: any) =>
    setTranslationSettings(settings);

  // --- Streak/session timer logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let lastSave = Date.now();
    const today = getTodayDateStr();
    // Get today's seconds (global, not per-surah)
    let todaySeconds = Number(localStorage.getItem("alquran_streak_today_seconds")) || 0;
    // Get checked days array
    let checkedDays: { date: string; seconds: number }[] = [];
    try {
      checkedDays = JSON.parse(localStorage.getItem("alquran_streak_checked_days") || "[]");
    } catch {}
    // Remove duplicate for today if exists
    checkedDays = checkedDays.filter((d) => d.date !== today);
    // Get last checked date (legacy)
    let lastChecked = localStorage.getItem("alquran_streak_last_checked") || "";

    // If new day, reset today's seconds
    if (lastChecked !== today) {
      todaySeconds = 0;
      localStorage.setItem("alquran_streak_today_seconds", "0");
    }

    function saveSession() {
      const currentDate = getTodayDateStr();
      // If date changed, reset the counter
      if (currentDate !== today) {
        todaySeconds = 0;
        localStorage.setItem("alquran_streak_today_seconds", "0");
        return;
      }
      localStorage.setItem("alquran_streak_today_seconds", String(todaySeconds));
      // Always update checkedDays with today's latest seconds if present
      const idx = checkedDays.findIndex((d) => d.date === today);
      if (idx !== -1) {
        checkedDays[idx].seconds = todaySeconds;
      }
      localStorage.setItem("alquran_streak_checked_days", JSON.stringify(checkedDays));
    }

    function checkGoal(minMinutes: number) {
      const currentDate = getTodayDateStr();
      // Only check goal for current date
      if (currentDate === today && todaySeconds >= minMinutes * 60) {
        // Add today to checkedDays if not already present
        if (!checkedDays.some((d) => d.date === today)) {
          checkedDays.push({ date: today, seconds: todaySeconds });
          localStorage.setItem("alquran_streak_checked_days", JSON.stringify(checkedDays));
        }
        // Legacy: set last_checked
        if (lastChecked !== today) {
          localStorage.setItem("alquran_streak_last_checked", today);
        }
      }
    }

    let isTabActive = true;
    function handleVisibility() {
      isTabActive = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibility);

    interval = setInterval(() => {
      if (isTabActive) {
        todaySeconds++;
        // Always get the latest minMinutes
        let minMinutes = Number(localStorage.getItem("alquran_streak_min_minutes")) || 3;
        // Save every 5 seconds
        if (Date.now() - lastSave > 5000) {
          saveSession();
          lastSave = Date.now();
        }
        checkGoal(minMinutes);
      }
    }, 1000);

    window.addEventListener("beforeunload", saveSession);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", saveSession);
      saveSession();
    };
  }, []);

  return (
    <>
      <SurahNavbar 
        onSettingsToggle={handleSettingsToggle} 
        onLeftSidebarToggle={handleLeftSidebarToggle}
        currentSurahNum={surahnum}
        onSettingsChange={handleSettingsChange}
      />
      <div className="flex flex-row w-full min-h-[93vh] bg-[#181818] overflow-hidden">
        {/* Left Sidebar: Surah List */}
        {showLeftSidebar && (
          <aside className="w-1/5 min-w-[220px] bg-[#181818] border-r border-gray-700 p-4 hidden md:block h-[93vh] sticky top-0 overflow-y-auto">
            <SurahList currentSurahNum={surahnum} />
          </aside>
        )}

        {/* Center Content: Main Surah Content */}
        <main className="flex-1 flex flex-col items-center justify-start px-2 md:px-8 h-[93vh] overflow-y-auto">
          {/* Existing Surah content */}
          <div className="flex flex-col gap-3 mt-5 w-full items-center justify-center mb-2">
            <p className="text-4xl md:text-5xl font-arabic">{surahName}</p>
            <p className="text-lg md:text-xl font-mono mb-2">
              {surahTranslation}
            </p>

            <div className="mb-14 w-full">
              {aayahList.length > 0 ? (
                aayahList.map((item, idx) => {
                  if (idx === aayahList.length - 1) {
                    return (
                      <div ref={lastAayahElementRef} key={item.number.inQuran}>
                        <Aayahcard
                          data={item}
                          surahnum={surahnum}
                          translationSettings={translationSettings}
                          fontSizeArabic={translationSettings.fontSizeArabic}
                          fontSizeEnglish={translationSettings.fontSizeEnglish}
                          fontSizeUrdu={translationSettings.fontSizeUrdu}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <Aayahcard
                        key={item.number.inQuran}
                        data={item}
                        surahnum={surahnum}
                        translationSettings={translationSettings}
                        fontSizeArabic={translationSettings.fontSizeArabic}
                        fontSizeEnglish={translationSettings.fontSizeEnglish}
                        fontSizeUrdu={translationSettings.fontSizeUrdu}
                      />
                    );
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
        </main>

        {/* Right Sidebar: Settings */}
        {showRightSidebar && (
          <aside className="w-1/5 min-w-[260px] bg-[#181818] border-l border-gray-700 p-4 hidden lg:block h-[93vh] sticky top-0 overflow-y-auto">
            <SettingPanel onSettingsChange={handleSettingsChange} />
          </aside>
        )}
      </div>
    </>
  );
};

export default SurahPage;
