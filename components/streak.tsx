// components/streak/StreakButton.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const minOptions = [3, 5, 10, 30, 60];

function getTodayDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function getStreakData() {
  let checkedDays: { date: string; seconds: number }[] = [];
  try {
    checkedDays = JSON.parse(localStorage.getItem("alquran_streak_checked_days") || "[]");
  } catch {}
  checkedDays.sort((a, b) => a.date.localeCompare(b.date));
  return checkedDays;
}

function getCurrentStreak(checkedDays: { date: string; seconds: number }[]) {
  let streak = 0;
  let today = getTodayDateStr();
  let d = new Date(today);
  for (let i = checkedDays.length - 1; i >= 0; i--) {
    const entry = checkedDays[i];
    if (entry.date === today) {
      streak++;
      d.setDate(d.getDate() - 1);
      today = d.toISOString().slice(0, 10);
    } else if (entry.date === today) {
      streak++;
      d.setDate(d.getDate() - 1);
      today = d.toISOString().slice(0, 10);
    } else if (entry.date === d.toISOString().slice(0, 10)) {
      streak++;
      d.setDate(d.getDate() - 1);
      today = d.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  return streak;
}

function getTodayProgress(minMinutes: number) {
  const today = getTodayDateStr();
  let todaySeconds = Number(localStorage.getItem("alquran_streak_today_seconds")) || 0;
  return {
    seconds: todaySeconds,
    percent: Math.min(100, (todaySeconds / (minMinutes * 60)) * 100),
  };
}

function ModalPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}

export default function StreakButton() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(
    typeof window !== "undefined"
      ? Number(localStorage.getItem("alquran_streak_min_minutes")) || null
      : null
  );
  const [showProgress, setShowProgress] = useState(false);
  const [checkedDays, setCheckedDays] = useState<{ date: string; seconds: number }[]>([]);
  const [minMinutes, setMinMinutes] = useState<number>(
    typeof window !== "undefined"
      ? Number(localStorage.getItem("alquran_streak_min_minutes")) || 3
      : 3
  );

  useEffect(() => {
    if (showProgress) {
      setCheckedDays(getStreakData());
      setMinMinutes(Number(localStorage.getItem("alquran_streak_min_minutes")) || 3);
    }
  }, [showProgress]);

  return (
    <>
      <button
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-300/10 text-yellow-400 text-xl font-bold"
        title="Streak"
        onClick={() => {
          if (!localStorage.getItem("alquran_streak_min_minutes")) {
            setShowModal(true);
          } else {
            setShowProgress(true);
          }
        }}
      >
        ⚡
      </button>
      {showModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Choose your daily streak goal
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                {minOptions.map((min) => (
                  <label
                    key={min}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="streak-minutes"
                      value={min}
                      checked={selectedMinutes === min}
                      onChange={() => setSelectedMinutes(min)}
                    />
                    <span className="text-gray-800">
                      {min} minute{min > 1 ? "s" : ""} per day
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold disabled:opacity-50"
                  disabled={selectedMinutes === null}
                  onClick={() => {
                    if (selectedMinutes !== null) {
                      localStorage.setItem(
                        "alquran_streak_min_minutes",
                        String(selectedMinutes)
                      );
                      setMinMinutes(selectedMinutes);
                      setShowModal(false);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
      {showProgress && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5">
            <div className="bg-[#161616] rounded-lg shadow-lg p-6 min-w-[340px] max-w-[95vw] w-full sm:w-[420px]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-200">Streak Progress</h2>
                <button className="text-gray-400 hover:text-gray-300 text-2xl" onClick={() => setShowProgress(false)}>&times;</button>
              </div>
              <div className="mb-4 flex w-full h-full gap-2">
                <span className="text-5xl flex flex-0 font-extrabold text-green-500 leading-none">{getCurrentStreak(checkedDays)}</span>
                <div className="flex flex-col leading-none h-11 justify-end">
                  <span className="uppercase text-xs text-gray-400 font-bold tracking-widest">{getCurrentStreak(checkedDays) > 1 ? 'DAYS' : 'DAY'}</span>
                  <span className="uppercase text-xs text-gray-400 font-bold tracking-widest">STREAK</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Today</span>
                  <span>{Math.floor(getTodayProgress(minMinutes).seconds / 60)} / {minMinutes} min</span>
                </div>
                <div className="w-full h-3 bg-[#212121] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all"
                    style={{ width: `${getTodayProgress(minMinutes).percent}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-center mb-4">
                {(() => {
                  const daysToShow = 33;
                  const boxesPerRow = 11;
                  const today = new Date(getTodayDateStr());
                  const dayBoxes = [];
                  for (let i = daysToShow - 1; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dateStr = d.toISOString().slice(0, 10);
                    const checked = checkedDays.find((cd) => cd.date === dateStr);
                    dayBoxes.push(
                      <div
                        key={dateStr}
                        className={`w-7 h-7 rounded-lg border mx-0.5 my-0.5 flex items-center justify-center shadow-sm transition
                          ${checked ? "bg-green-400 border-green-600 text-green-900" : "bg-[#212121] border-[#393939] text-gray-500"}`}
                        title={
                          checked
                            ? `Read ${Math.floor(checked.seconds / 60)} min on ${d.toLocaleDateString()}`
                            : d.toLocaleDateString()
                        }
                      >
                        {checked ? (
                          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8.5L7 11.5L12 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        ) : ""}
                      </div>
                    );
                  }
                  // Split into rows
                  const rows = [];
                  for (let i = 0; i < daysToShow; i += boxesPerRow) {
                    rows.push(
                      <div key={i} className="flex flex-row justify-center">
                        {dayBoxes.slice(i, i + boxesPerRow)}
                      </div>
                    );
                  }
                  return rows;
                })()}
              </div>
              <button
                className="mt-2 px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-gray-900 font-bold w-full"
                onClick={() => {
                  setShowProgress(false);
                  setShowModal(true);
                }}
              >
                Change Goal
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}