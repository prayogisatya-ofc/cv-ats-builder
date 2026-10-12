import { useEffect, useRef, useState } from "react";
import { defaultCV } from "./defaultCV";
import { exportJSON, importJSONFile, loadCV, normalizeCV, saveCV } from "./storage";
import { printHtmlToPdf } from "./printToPdf";
import { renderToStaticMarkup } from "react-dom/server";
import { CVPrint } from "./CVPrint";

import CVPreview from "./CVPreview";
import { AccordionItem, ConfirmDialog, ItemHeader, Panel, PanelHeader } from "./ui";

import {
  IconUser,
  IconFileText,
  IconBriefcase,
  IconSchool,
  IconCertificate,
  IconTrophy,
  IconStars,
  IconBulb,
  IconDownload,
  IconFileTypePdf,
  IconRefresh,
  IconCode,
  IconCoffee,
  IconGripVertical,
  IconChevronUp,
  IconChevronDown,
  IconUpload,
  IconAlertTriangle,
  IconTrash,
} from "@tabler/icons-react";

const TRAKTEER_URL = "https://trakteer.id/igoyclick";

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <input
        type={type}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <textarea
        rows={rows}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <input
        type="text"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        value={value || ""}
        placeholder="Contoh: Jan 2024"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function bulletsToText(arr) {
  if (typeof arr === "string") return arr;
  return (arr || []).join("\n");
}

function textToBullets(txt = "") {
  if (!txt) return [];
  // Jangan trim/filter di sini agar spasi bisa diketik.
  // Trim & filter hanya saat render (preview/print).
  return txt.replace(/\r/g, "").split("\n").map((line) => line.replace(/\t/g, " "));
}

function ListOrTextArea({
  label,
  value,
  mode,
  onChange,
  placeholderList,
  placeholderText,
  rows = 5,
}) {
  const effectiveMode =
    mode === "text" || mode === "list"
      ? mode
      : typeof value === "string"
        ? "text"
        : "list";
  const isText = effectiveMode === "text";
  const displayValue = isText
    ? typeof value === "string"
      ? value
      : bulletsToText(value)
    : Array.isArray(value)
      ? bulletsToText(value)
      : typeof value === "string"
        ? value
        : "";

  const setMode = (next) => {
    if (next === effectiveMode) return;
    if (next === "text") {
      onChange(bulletsToText(value), "text");
    } else {
      onChange(textToBullets(typeof value === "string" ? value : bulletsToText(value)), "list");
    }
  };

  const btnBase =
    "cursor-pointer rounded-md px-2.5 py-1 transition-all";
  const btnActive = "bg-white text-slate-800 shadow-sm";
  const btnInactive = "text-slate-500 hover:text-slate-700";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </div>
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode("list")}
            className={`${btnBase} ${!isText ? btnActive : btnInactive}`}
            title="Tampilkan sebagai bullet list"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`${btnBase} ${isText ? btnActive : btnInactive}`}
            title="Tampilkan sebagai teks biasa/paragraf"
          >
            Teks
          </button>
        </div>
      </div>
      <textarea
        rows={rows}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        value={displayValue}
        placeholder={isText ? placeholderText : placeholderList}
        onChange={(e) =>
          onChange(isText ? e.target.value : textToBullets(e.target.value), effectiveMode)
        }
      />
      <div className="text-[11px] text-slate-400">
        {isText
          ? "Mode teks: tampil sebagai paragraf biasa."
          : "Mode list: 1 baris = 1 poin bullet."}
      </div>
    </div>
  );
}

const MONTHS = [
  { value: "Jan", label: "Januari" },
  { value: "Feb", label: "Februari" },
  { value: "Mar", label: "Maret" },
  { value: "Apr", label: "April" },
  { value: "Mei", label: "Mei" },
  { value: "Jun", label: "Juni" },
  { value: "Jul", label: "Juli" },
  { value: "Agu", label: "Agustus" },
  { value: "Sep", label: "September" },
  { value: "Okt", label: "Oktober" },
  { value: "Nov", label: "November" },
  { value: "Des", label: "Desember" },
];

function formatMonthYear(month, year) {
  const m = (month || "").trim();
  const y = (year || "").trim();
  if (!m && !y) return "";
  if (m && y) return `${m} ${y}`;
  return `${m}${y ? ` ${y}` : ""}`.trim();
}

function formatRange(item) {
  const start = formatMonthYear(item.startMonth, item.startYear);
  const end = item.isCurrent ? "Sekarang" : formatMonthYear(item.endMonth, item.endYear);
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
}

function MonthSelect({ label, value, onChange, disabled }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <select
        className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
          disabled ? "opacity-60" : ""
        }`}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Pilih bulan</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function YearInput({ label, value, onChange, disabled, placeholder = "2024" }) {
  return (
    <label className="block space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <input
        type="text"
        inputMode="numeric"
        className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
          disabled ? "opacity-60" : ""
        }`}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  );
}

function PeriodFields({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent,
  onChange,
}) {
  const endDisabled = !!isCurrent;

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2">
        <MonthSelect
          label="Mulai (Bulan)"
          value={startMonth}
          onChange={(v) => onChange({ startMonth: v })}
        />
        <YearInput
          label="Mulai (Tahun)"
          value={startYear}
          onChange={(v) => onChange({ startYear: v })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MonthSelect
          label="Selesai (Bulan)"
          value={endMonth}
          onChange={(v) => onChange({ endMonth: v })}
          disabled={endDisabled}
        />
        <YearInput
          label="Selesai (Tahun)"
          value={endYear}
          onChange={(v) => onChange({ endYear: v })}
          disabled={endDisabled}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-slate-500 cursor-pointer">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 cursor-pointer"
          checked={!!isCurrent}
          onChange={(e) => {
            const checked = e.target.checked;
            onChange({
              isCurrent: checked,
              ...(checked ? { endMonth: "", endYear: "" } : {}),
            });
          }}
        />
        Masih dilakukan
      </label>
    </div>
  );
}

function moveArray(arr = [], from, to) {
  if (from === to) return arr;
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function createDragStart(listId, index) {
  return (e) => {
    e.dataTransfer.setData("text/plain", `${listId}:${index}`);
    e.dataTransfer.effectAllowed = "move";
  };
}

function parseDrop(listId, e) {
  const raw = e.dataTransfer.getData("text/plain") || "";
  const [srcList, srcIdx] = raw.split(":");
  if (srcList !== listId) return null;
  const from = Number(srcIdx);
  if (!Number.isInteger(from)) return null;
  return from;
}

function DroppableCard({ listId, index, onMove, children }) {
  const [isOver, setIsOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const from = parseDrop(listId, e);
        if (from !== null && from !== index) onMove(from, index);
      }}
      className={`group relative rounded-xl border bg-slate-50 p-5 transition-all hover:border-blue-300 hover:shadow-md ${
        isOver ? "border-blue-500 shadow-md ring-2 ring-blue-200" : "border-slate-200"
      }`}
    >
      {children}
    </div>
  );
}

function AwardRow({ listId, index, total, onMove, children }) {
  const [isOver, setIsOver] = useState(false);
  const btnCls =
    "flex h-10 w-8 shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-25";
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const from = parseDrop(listId, e);
        if (from !== null && from !== index) onMove(from, index);
      }}
      className={`flex items-center gap-1 rounded-lg border bg-white transition-all ${
        isOver ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"
      }`}
    >
      <span
        draggable
        onDragStart={createDragStart(listId, index)}
        className="cursor-grab touch-none rounded-md p-1 pl-2 text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        title="Seret untuk mengurutkan"
      >
        <IconGripVertical size={16} />
      </span>
      <div className="flex flex-col">
        <button type="button" className={btnCls} onClick={() => onMove(index, index - 1)} disabled={index <= 0} title="Pindah ke atas">
          <IconChevronUp size={14} />
        </button>
        <button type="button" className={btnCls} onClick={() => onMove(index, index + 1)} disabled={index >= total - 1} title="Pindah ke bawah">
          <IconChevronDown size={14} />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 py-1 pr-1">{children}</div>
    </div>
  );
}

export default function App() {
  const [cv, setCV] = useState(() => {
    try {
      const loaded = loadCV();
      return loaded ? normalizeCV(loaded) : defaultCV;
    } catch {
      return defaultCV;
    }
  });
  const fileRef = useRef(null);
  const [showReset, setShowReset] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState(null);

  useEffect(() => saveCV(cv), [cv]);

  const setHeader = (patch) =>
    setCV((prev) => ({ ...prev, header: { ...(prev.header || {}), ...patch } }));

  const moveInList = (key, from, to) =>
    setCV((p) => ({ ...p, [key]: moveArray(p[key] || [], from, to) }));

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const raw = await importJSONFile(file);
      const normalized = normalizeCV(raw);
      setPendingImport({ data: normalized, name: file.name });
    } catch (err) {
      setImportError("File JSON tidak valid. Pastikan file hasil Export JSON.");
    }
  };

  const exportPdf = () => {
    const html = renderToStaticMarkup(<CVPrint cv={cv} />);
    printHtmlToPdf({ title: "CV ATS", html });
  };

  return (
    <div className="min-h-screen bg-[#f3f6fc] text-slate-800">
      {/* TOPBAR */}
      <nav className="sticky top-0 z-50 border-b border-blue-100/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
            <div className="hidden leading-tight md:block">
              <div className="font-bold text-slate-900">CV ATS Builder</div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-blue-600">by Igoy</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={TRAKTEER_URL} 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Trakteer" 
              title="Traktir aku di Trakteer" 
              className="group flex cursor-pointer items-center gap-2 rounded-lg border border-[#E50027] bg-[#E50027] hover:bg-[#E50027]/80 px-3 py-2 text-xs font-bold text-white transition"
            >
              <IconCoffee size={16} />
              <span className="hidden sm:inline">Trakteer</span>
            </a>

            <button
              className="cursor-pointer group cursor-pointer flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
              onClick={() => exportJSON(cv)}
              title="Download Data JSON"
              type="button"
            >
              <IconCode size={16} />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
              onClick={() => fileRef.current?.click()}
              title="Import Data JSON"
              type="button"
            >
              <IconUpload size={16} />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />

            <div className="mx-1 h-6 w-px bg-slate-200"></div>

            <button
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
              onClick={() => setShowReset(true)}
              title="Reset ke Default"
              type="button"
            >
              <IconRefresh size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_480px] lg:px-6 xl:grid-cols-[1fr_550px]">
        <div className="space-y-5">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Informasi CV</h1>
            <p className="text-sm text-slate-500">Lengkapi data di bawah ini untuk menyusun CV Anda.</p>
          </div>

          <AccordionItem icon={IconUser} title="Data Pribadi" defaultOpen>
            <div className="grid gap-4">
              <TextInput
                label="Nama Lengkap"
                value={cv.header?.name}
                onChange={(v) => setHeader({ name: v })}
                placeholder="Ex: Budi Santoso"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Email"
                  value={cv.header?.email}
                  onChange={(v) => setHeader({ email: v })}
                  placeholder="email@domain.com"
                />
                <TextInput
                  label="No. HP"
                  value={cv.header?.phone}
                  onChange={(v) => setHeader({ phone: v })}
                  placeholder="+62 812..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="LinkedIn (URL)"
                  value={cv.header?.linkedin}
                  onChange={(v) => setHeader({ linkedin: v })}
                  placeholder="linkedin.com/in/..."
                />
                <TextInput
                  label="Domisili"
                  value={cv.header?.location}
                  onChange={(v) => setHeader({ location: v })}
                  placeholder="Jakarta, Indonesia"
                />
              </div>

              <TextInput
                label="Website / Portofolio"
                value={cv.header?.website}
                onChange={(v) => setHeader({ website: v })}
                placeholder="www.portofolio.com"
              />
            </div>
          </AccordionItem>

          <AccordionItem icon={IconFileText} title="Ringkasan Profesional" defaultOpen>
            <TextArea
              label="Deskripsi Diri"
              value={cv.summary}
              onChange={(v) => setCV((p) => ({ ...p, summary: v }))}
              placeholder="Jelaskan pengalaman dan keahlian utama Anda secara singkat..."
              rows={5}
            />
          </AccordionItem>

          <AccordionItem icon={IconSchool} title="Pendidikan" defaultOpen>
            <div className="space-y-4">
              {(cv.education || []).map((e, idx) => (
                <DroppableCard key={idx} listId="education" index={idx} onMove={(from, to) => moveInList("education", from, to)}>
                  <ItemHeader
                    title={`Pendidikan #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({ ...p, education: (p.education || []).filter((_, i) => i !== idx) }))
                    }
                    index={idx}
                    total={(cv.education || []).length}
                    onMove={(from, to) => moveInList("education", from, to)}
                    onDragStart={createDragStart("education", idx)}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Institusi"
                      value={e.school}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], school: v };
                          return { ...p, education: next };
                        })
                      }
                      placeholder="Universitas Indonesia"
                    />
                    <TextInput
                      label="Jurusan"
                      value={e.degree}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], degree: v };
                          return { ...p, education: next };
                        })
                      }
                      placeholder="S1 Ilmu Komputer"
                    />
                  </div>

                  <div className="mt-4">
                    <PeriodFields
                      startMonth={e.startMonth}
                      startYear={e.startYear}
                      endMonth={e.endMonth}
                      endYear={e.endYear}
                      isCurrent={e.isCurrent}
                      onChange={(patch) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], ...patch };
                          return { ...p, education: next };
                        })
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Lokasi"
                      value={e.location}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], location: v };
                          return { ...p, education: next };
                        })
                      }
                      placeholder="Depok"
                    />
                    <TextInput
                      label="IPK / GPA (Opsional)"
                      value={e.gpa}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], gpa: v };
                          return { ...p, education: next };
                        })
                      }
                      placeholder="3.85 / 4.00"
                    />
                  </div>

                  <div className="mt-4">
                    <ListOrTextArea
                      label="Pencapaian"
                      value={e.highlights}
                      mode={e.highlightsMode}
                      onChange={(v, m) =>
                        setCV((p) => {
                          const next = [...p.education];
                          next[idx] = { ...next[idx], highlights: v, highlightsMode: m };
                          return { ...p, education: next };
                        })
                      }
                      placeholderList="- Menjadi Juara 1 dalam kompetisi..."
                      placeholderText="Tulis pencapaian dalam bentuk paragraf bebas..."
                      rows={5}
                    />
                  </div>
                </DroppableCard>
              ))}

              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({
                    ...p,
                    education: [
                      ...(p.education || []),
                      { school: "", degree: "", location: "", start: "", end: "", gpa: "", highlights: [], highlightsMode: "list" },
                    ],
                  }))
                }
              >
                + Tambah Pendidikan
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconBriefcase} title="Pengalaman Kerja" defaultOpen>
            <div className="space-y-4">
              {(cv.work || []).map((w, idx) => (
                <DroppableCard key={idx} listId="work" index={idx} onMove={(from, to) => moveInList("work", from, to)}>
                  <ItemHeader
                    title={`Pengalaman #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({ ...p, work: (p.work || []).filter((_, i) => i !== idx) }))
                    }
                    index={idx}
                    total={(cv.work || []).length}
                    onMove={(from, to) => moveInList("work", from, to)}
                    onDragStart={createDragStart("work", idx)}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Perusahaan"
                      value={w.company}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.work];
                          next[idx] = { ...next[idx], company: v };
                          return { ...p, work: next };
                        })
                      }
                      placeholder="Nama PT..."
                    />
                    <TextInput
                      label="Jabatan"
                      value={w.role}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.work];
                          next[idx] = { ...next[idx], role: v };
                          return { ...p, work: next };
                        })
                      }
                      placeholder="Senior Engineer"
                    />
                  </div>

                  <div className="mt-4">
                    <PeriodFields
                      startMonth={w.startMonth}
                      startYear={w.startYear}
                      endMonth={w.endMonth}
                      endYear={w.endYear}
                      isCurrent={w.isCurrent}
                      onChange={(patch) =>
                        setCV((p) => {
                          const next = [...p.work];
                          next[idx] = { ...next[idx], ...patch };
                          return { ...p, work: next };
                        })
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <TextInput
                      label="Lokasi"
                      value={w.location}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.work];
                          next[idx] = { ...next[idx], location: v };
                          return { ...p, work: next };
                        })
                      }
                      placeholder="Jakarta (Hybrid)"
                    />
                  </div>

                  <div className="mt-4">
                    <ListOrTextArea
                      label="Pencapaian"
                      value={w.bullets}
                      mode={w.bulletsMode}
                      onChange={(v, m) =>
                        setCV((p) => {
                          const next = [...p.work];
                          next[idx] = { ...next[idx], bullets: v, bulletsMode: m };
                          return { ...p, work: next };
                        })
                      }
                      placeholderList="- Berhasil meningkatkan penjualan..."
                      placeholderText="Tulis pencapaian dalam bentuk paragraf bebas..."
                      rows={5}
                    />
                  </div>
                </DroppableCard>
              ))}

              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({
                    ...p,
                    work: [
                      ...(p.work || []),
                      { company: "", role: "", location: "", start: "", end: "", bullets: [], bulletsMode: "list" },
                    ],
                  }))
                }
              >
                + Tambah Pengalaman
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconBriefcase} title="Pengalaman Magang">
            <div className="space-y-4">
              {(cv.internship || []).map((w, idx) => (
                <DroppableCard key={idx} listId="internship" index={idx} onMove={(from, to) => moveInList("internship", from, to)}>
                  <ItemHeader
                    title={`Magang #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({ ...p, internship: (p.internship || []).filter((_, i) => i !== idx) }))
                    }
                    index={idx}
                    total={(cv.internship || []).length}
                    onMove={(from, to) => moveInList("internship", from, to)}
                    onDragStart={createDragStart("internship", idx)}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Instansi"
                      value={w.company}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.internship];
                          next[idx] = { ...next[idx], company: v };
                          return { ...p, internship: next };
                        })
                      }
                    />
                    <TextInput
                      label="Posisi"
                      value={w.role}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.internship];
                          next[idx] = { ...next[idx], role: v };
                          return { ...p, internship: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <PeriodFields
                      startMonth={w.startMonth}
                      startYear={w.startYear}
                      endMonth={w.endMonth}
                      endYear={w.endYear}
                      isCurrent={w.isCurrent}
                      onChange={(patch) =>
                        setCV((p) => {
                          const next = [...p.internship];
                          next[idx] = { ...next[idx], ...patch };
                          return { ...p, internship: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <TextInput
                      label="Lokasi"
                      value={w.location}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.internship];
                          next[idx] = { ...next[idx], location: v };
                          return { ...p, internship: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <ListOrTextArea
                      label="Deskripsi"
                      value={w.bullets}
                      mode={w.bulletsMode}
                      onChange={(v, m) =>
                        setCV((p) => {
                          const next = [...p.internship];
                          next[idx] = { ...next[idx], bullets: v, bulletsMode: m };
                          return { ...p, internship: next };
                        })
                      }
                      placeholderList="Tulis 1 poin per baris..."
                      placeholderText="Tulis deskripsi dalam bentuk paragraf bebas..."
                      rows={5}
                    />
                  </div>
                </DroppableCard>
              ))}
              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({
                    ...p,
                    internship: [
                      ...(p.internship || []),
                      { company: "", role: "", location: "", start: "", end: "", bullets: [], bulletsMode: "list" },
                    ],
                  }))
                }
              >
                + Tambah Magang
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconBulb} title="Organisasi">
            <div className="space-y-4">
              {(cv.organization || []).map((o, idx) => (
                <DroppableCard key={idx} listId="organization" index={idx} onMove={(from, to) => moveInList("organization", from, to)}>
                  <ItemHeader
                    title={`Organisasi #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({
                        ...p,
                        organization: (p.organization || []).filter((_, i) => i !== idx),
                      }))
                    }
                    index={idx}
                    total={(cv.organization || []).length}
                    onMove={(from, to) => moveInList("organization", from, to)}
                    onDragStart={createDragStart("organization", idx)}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Nama Organisasi"
                      value={o.name}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.organization];
                          next[idx] = { ...next[idx], name: v };
                          return { ...p, organization: next };
                        })
                      }
                    />
                    <TextInput
                      label="Jabatan"
                      value={o.role}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.organization];
                          next[idx] = { ...next[idx], role: v };
                          return { ...p, organization: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <PeriodFields
                      startMonth={o.startMonth}
                      startYear={o.startYear}
                      endMonth={o.endMonth}
                      endYear={o.endYear}
                      isCurrent={o.isCurrent}
                      onChange={(patch) =>
                        setCV((p) => {
                          const next = [...p.organization];
                          next[idx] = { ...next[idx], ...patch };
                          return { ...p, organization: next };
                        })
                      }
                    />
                  </div>
                </DroppableCard>
              ))}
              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({
                    ...p,
                    organization: [...(p.organization || []), { name: "", role: "", start: "", end: "", affiliation: "" }],
                  }))
                }
              >
                + Tambah Organisasi
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconStars} title="Keahlian (Skill)">
            <div className="space-y-5">
              <TextArea
                label="Soft Skill (Pisahkan dengan koma)"
                value={cv.skills?.soft || ""}
                onChange={(v) =>
                  setCV((p) => ({
                    ...p,
                    skills: { ...(p.skills || {}), soft: v },
                  }))
                }
                placeholder="Komunikasi, Kepemimpinan, Problem Solving"
                rows={2}
              />

              <TextArea
                label="Hard Skill (Pisahkan dengan koma)"
                value={cv.skills?.hard || ""}
                onChange={(v) =>
                  setCV((p) => ({
                    ...p,
                    skills: { ...(p.skills || {}), hard: v },
                  }))
                }
                placeholder="Data Analysis, SEO, Project Management"
                rows={2}
              />

              <TextArea
                label="Tools / Software (Pisahkan dengan koma)"
                value={cv.skills?.tools || ""}
                onChange={(v) =>
                  setCV((p) => ({
                    ...p,
                    skills: { ...(p.skills || {}), tools: v },
                  }))
                }
                placeholder="Microsoft Excel, Figma, VS Code"
                rows={2}
              />
            </div>
          </AccordionItem>

          <AccordionItem icon={IconCertificate} title="Sertifikasi">
            <div className="space-y-4">
              {(cv.certification || []).map((c, idx) => (
                <DroppableCard key={idx} listId="certification" index={idx} onMove={(from, to) => moveInList("certification", from, to)}>
                  <ItemHeader
                    title={`Sertifikasi #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({
                        ...p,
                        certification: (p.certification || []).filter((_, i) => i !== idx),
                      }))
                    }
                    index={idx}
                    total={(cv.certification || []).length}
                    onMove={(from, to) => moveInList("certification", from, to)}
                    onDragStart={createDragStart("certification", idx)}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Nama Sertifikasi"
                      value={c.name}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.certification];
                          next[idx] = { ...next[idx], name: v };
                          return { ...p, certification: next };
                        })
                      }
                    />
                    <TextInput
                      label="Penerbit"
                      value={c.issuer}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.certification];
                          next[idx] = { ...next[idx], issuer: v };
                          return { ...p, certification: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Tahun"
                      value={c.year}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.certification];
                          next[idx] = { ...next[idx], year: v };
                          return { ...p, certification: next };
                        })
                      }
                    />
                    <TextInput
                      label="Nomor Sertifikat"
                      value={c.number}
                      onChange={(v) =>
                        setCV((p) => {
                          const next = [...p.certification];
                          next[idx] = { ...next[idx], number: v };
                          return { ...p, certification: next };
                        })
                      }
                    />
                  </div>
                </DroppableCard>
              ))}
              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({
                    ...p,
                    certification: [...(p.certification || []), { name: "", issuer: "", year: "", number: "" }],
                  }))
                }
              >
                + Tambah Sertifikasi
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconTrophy} title="Penghargaan">
            <div className="space-y-3">
              {(cv.awards || []).map((a, idx) => (
                <AwardRow
                  key={idx}
                  listId="awards"
                  index={idx}
                  total={(cv.awards || []).length}
                  onMove={(from, to) => moveInList("awards", from, to)}
                >
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    value={a}
                    onChange={(e) =>
                      setCV((p) => {
                        const next = [...p.awards];
                        next[idx] = e.target.value;
                        return { ...p, awards: next };
                      })
                    }
                    placeholder="Contoh: Juara 1 Lomba Coding Nasional 2023"
                  />
                  <button
                    type="button"
                    className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
                    onClick={() =>
                      setCV((p) => ({ ...p, awards: (p.awards || []).filter((_, i) => i !== idx) }))
                    }
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                </AwardRow>
              ))}
              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() => setCV((p) => ({ ...p, awards: [...(p.awards || []), ""] }))}
              >
                + Tambah Penghargaan
              </button>
            </div>
          </AccordionItem>

          <AccordionItem icon={IconBulb} title="Proyek (Opsional)">
            <div className="space-y-4">
              {(cv.projects || []).map((pjt, idx) => (
                <DroppableCard key={idx} listId="projects" index={idx} onMove={(from, to) => moveInList("projects", from, to)}>
                  <ItemHeader
                    title={`Proyek #${idx + 1}`}
                    onRemove={() =>
                      setCV((p) => ({ ...p, projects: (p.projects || []).filter((_, i) => i !== idx) }))
                    }
                    index={idx}
                    total={(cv.projects || []).length}
                    onMove={(from, to) => moveInList("projects", from, to)}
                    onDragStart={createDragStart("projects", idx)}
                  />
                  <TextInput
                    label="Nama Proyek"
                    value={pjt.name}
                    onChange={(v) =>
                      setCV((p) => {
                        const next = [...p.projects];
                        next[idx] = { ...next[idx], name: v };
                        return { ...p, projects: next };
                      })
                    }
                  />
                  <div className="mt-4">
                    <ListOrTextArea
                      label="Deskripsi Proyek"
                      value={pjt.bullets}
                      mode={pjt.bulletsMode}
                      onChange={(v, m) =>
                        setCV((p) => {
                          const next = [...p.projects];
                          next[idx] = { ...next[idx], bullets: v, bulletsMode: m };
                          return { ...p, projects: next };
                        })
                      }
                      placeholderList="Tulis 1 poin per baris..."
                      placeholderText="Tulis deskripsi proyek dalam bentuk paragraf bebas..."
                      rows={3}
                    />
                  </div>
                </DroppableCard>
              ))}
              <button
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                type="button"
                onClick={() =>
                  setCV((p) => ({ ...p, projects: [...(p.projects || []), { name: "", bullets: [], bulletsMode: "list" }] }))
                }
              >
                + Tambah Proyek
              </button>
            </div>
          </AccordionItem>

        </div>

        <div className="lg:relative">
          <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-8rem)] lg:flex-col lg:gap-4">

            <Panel>
              <PanelHeader title="Preview Dokumen" icon={IconDownload} />

              <div className="relative flex-1 bg-slate-100 p-4 lg:overflow-y-auto lg:rounded-b-2xl custom-scrollbar">
                <div className="mx-auto min-h-[500px] w-full max-w-[210mm] origin-top bg-white shadow-xl lg:scale-[0.85] xl:scale-90">
                  <CVPreview cv={cv} />
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white p-4 lg:rounded-b-2xl">
                <button
                  className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                  onClick={exportPdf}
                  type="button"
                >
                  <IconFileTypePdf size={20} />
                  <span>Download PDF</span>
                </button>
              </div>
            </Panel>

            <div className="mt-4 flex items-start gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 self-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-astro-cid-j7pv25f6=""></path> 
              </svg>
              <span className="text-xs font-medium text-slate-600">100% offline. Data hanya disimpan di browser Anda.</span>
            </div>

            <div className="hidden text-center text-xs text-slate-400 lg:block">
              &copy; {new Date().getFullYear()} CV ATS Builder by Igoy.
            </div>
          </div>
        </div>
      </main>

      <a
        href={TRAKTEER_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed flex gap-2 right-0 top-2/3 z-50 -translate-y-1/2 rounded-l-xl bg-[#E50027] px-3 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-[#E50027]/80"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <IconCoffee size={16} className="rotate-90" />
        Trakteer
      </a>

      <ConfirmDialog
        open={showReset}
        title="Reset semua data?"
        message="Seluruh isian CV akan dikembalikan ke bawaan dan data saat ini akan hilang. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Ya, reset"
        cancelLabel="Batal"
        confirmClass="bg-red-600 hover:bg-red-700"
        icon={
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <IconTrash size={22} />
          </span>
        }
        onCancel={() => setShowReset(false)}
        onConfirm={() => {
          localStorage.removeItem("cv_ats_builder_v1");
          setCV(defaultCV);
          setShowReset(false);
        }}
      />

      <ConfirmDialog
        open={!!pendingImport}
        title="Timpa data dengan file import?"
        message={
          pendingImport
            ? `File "${pendingImport.name}" akan menimpa seluruh data CV saat ini.`
            : ""
        }
        confirmLabel="Ya, import"
        cancelLabel="Batal"
        confirmClass="bg-blue-600 hover:bg-blue-700"
        icon={
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <IconUpload size={22} />
          </span>
        }
        onCancel={() => setPendingImport(null)}
        onConfirm={() => {
          if (pendingImport) setCV(pendingImport.data);
          setPendingImport(null);
        }}
      />

      <ConfirmDialog
        open={!!importError}
        title="Import gagal"
        message={importError || ""}
        confirmLabel="Mengerti"
        singleButton
        confirmClass="bg-slate-800 hover:bg-slate-900"
        icon={
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <IconAlertTriangle size={22} />
          </span>
        }
        onConfirm={() => setImportError(null)}
        onCancel={() => setImportError(null)}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-pop {
          animation: modal-pop 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}