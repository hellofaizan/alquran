import React, { useState, useEffect, useRef } from "react";

function getInitialSettings() {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("alquran_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        showEnglish: parsed.showEnglish ?? true,
        showUrdu: parsed.showUrdu ?? false,
        fontSizeArabic: parsed.fontSizeArabic ?? 3,
        fontSizeEnglish: parsed.fontSizeEnglish ?? 2,
        fontSizeUrdu: parsed.fontSizeUrdu ?? 2,
      };
    }
  }
  return { showEnglish: true, showUrdu: false, fontSizeArabic: 3, fontSizeEnglish: 2, fontSizeUrdu: 2 };
}

const TRANSLATION_OPTIONS = [
  { label: "English Translation", value: "english" },
  { label: "Urdu Translation", value: "urdu" },
];

export default function SettingPanel({ onSettingsChange }: { onSettingsChange?: (settings: any) => void }) {
  const [showFont, setShowFont] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [settings, setSettings] = useState(getInitialSettings);
  const [open, setOpen] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  const showEnglish = settings.showEnglish;
  const showUrdu = settings.showUrdu;
  const fontSizeArabic = settings.fontSizeArabic;
  const fontSizeEnglish = settings.fontSizeEnglish;
  const fontSizeUrdu = settings.fontSizeUrdu;

  // Multi-select logic
  const selected: string[] = [];
  if (showEnglish) selected.push("english");
  if (showUrdu) selected.push("urdu");

  const handleSelect = (value: string) => {
    if (value === "english") setSettings((s: any) => ({ ...s, showEnglish: !s.showEnglish }));
    if (value === "urdu") setSettings((s: any) => ({ ...s, showUrdu: !s.showUrdu }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Save settings to localStorage and notify parent
  useEffect(() => {
    localStorage.setItem("alquran_settings", JSON.stringify(settings));
    if (onSettingsChange) onSettingsChange(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg mb-2 text-white">Settings</h2>
      {/* Multi-select Combo Box for Translations */}
      <div className="flex flex-col gap-1">
        <label className="text-md text-gray-400 mb-1">Translations</label>
        <div ref={comboRef} className="relative">
          <button
            className="w-full bg-[#232323] border border-gray-700 rounded px-3 py-2 text-gray-200 flex items-center justify-between"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span>
              {selected.length === 0
                ? "Select translations"
                : TRANSLATION_OPTIONS.filter(opt => selected.includes(opt.value)).map(opt => opt.label).join(", ")}
            </span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {open && (
            <div className="absolute z-10 mt-1 w-full bg-[#232323] border border-gray-700 rounded shadow-lg">
              {TRANSLATION_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-[#181818] ${selected.includes(opt.value) ? 'bg-[#181818]' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.value)}
                    readOnly
                    className="accent-[#22A5AD] w-4 h-4 mr-2"
                  />
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Font Size Scales */}
      <div className="flex items-center justify-between mt-2">
        <label className="text-md text-gray-400">Arabic font size</label>
        <div className="flex items-center gap-3">
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeArabic: Math.max(1, fontSizeArabic - 1) }))}
            aria-label="Decrease Arabic font size"
          >
            –
          </button>
          <span className="text-base text-gray-200 w-4 text-center">{fontSizeArabic}</span>
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeArabic: Math.min(5, fontSizeArabic + 1) }))}
            aria-label="Increase Arabic font size"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 opacity-100" style={{ opacity: showEnglish ? 1 : 0.5 }}>
        <label className="text-md text-gray-400">English font size</label>
        <div className="flex items-center gap-3">
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeEnglish: Math.max(1, fontSizeEnglish - 1) }))}
            aria-label="Decrease English font size"
            disabled={!showEnglish}
          >
            –
          </button>
          <span className="text-base text-gray-200 w-4 text-center">{fontSizeEnglish}</span>
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeEnglish: Math.min(5, fontSizeEnglish + 1) }))}
            aria-label="Increase English font size"
            disabled={!showEnglish}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 opacity-100" style={{ opacity: showUrdu ? 1 : 0.5 }}>
        <label className="text-md text-gray-400">Urdu font size</label>
        <div className="flex items-center gap-3">
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeUrdu: Math.max(1, fontSizeUrdu - 1) }))}
            aria-label="Decrease Urdu font size"
            disabled={!showUrdu}
          >
            –
          </button>
          <span className="text-base text-gray-200 w-4 text-center">{fontSizeUrdu}</span>
          <button
            className="text-2xl text-gray-300 px-2"
            onClick={() => setSettings((s: any) => ({ ...s, fontSizeUrdu: Math.min(5, fontSizeUrdu + 1) }))}
            aria-label="Increase Urdu font size"
            disabled={!showUrdu}
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400">SCRIPT</label>
        <select className="w-full p-2 rounded bg-[#232323] text-white border border-gray-700 mt-1">
          <option>Uthmani</option>
          <option>IndoPak</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400">TAFSEER</label>
        <select className="w-full p-2 rounded bg-[#232323] text-white border border-gray-700 mt-1">
          <option>Ibn Kathir</option>
          <option>Jalalayn</option>
        </select>
      </div>
      <div>
        <button
          className="flex items-center gap-2 mt-2 text-sm font-semibold"
          onClick={() => setShowAudio((v) => !v)}
        >
          <span>Audio Settings</span>
          <span>{showAudio ? "-" : "+"}</span>
        </button>
        {showAudio && (
          <div className="pl-4 mt-2 text-xs text-gray-500">
            Audio options (coming soon)
          </div>
        )}
      </div>
    </div>
  );
}
