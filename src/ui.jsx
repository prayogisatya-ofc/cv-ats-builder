import { useEffect } from "react";
import { IconChevronDown, IconChevronUp, IconGripVertical, IconX } from "@tabler/icons-react";

export function AccordionItem({
    icon: Icon,
    title,
    children,
    defaultOpen = false,
}) {
    return (
        <details
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md open:border-blue-200 open:shadow-blue-500/5"
            open={defaultOpen}
        >
            <summary className="flex cursor-pointer select-none items-center justify-between bg-white px-5 py-4 transition-colors hover:bg-slate-50 group-open:border-b group-open:border-slate-100 group-open:bg-blue-50/30">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-open:bg-blue-600 group-open:text-white">
                        <Icon size={18} />
                    </span>
                    <div className="font-bold text-slate-800 group-open:text-blue-700">
                        {title}
                    </div>
                </div>
                <IconChevronDown
                    className="text-slate-400 transition-transform duration-300 group-open:-rotate-180 group-open:text-blue-500"
                    size={20}
                />
            </summary>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-white px-5 py-5">
                {children}
            </div>
        </details>
    );
}

export function Panel({ children }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
            {children}
        </div>
    );
}

export function PanelHeader({ title, icon: Icon }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
                {Icon ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Icon size={16} />
                    </span>
                ) : null}
                <div className="font-bold text-slate-800">{title}</div>
            </div>
            <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
        </div>
    );
}

export function ItemHeader({ title, onRemove, index, total, onMove, onDragStart }) {
    const showReorder = typeof index === "number" && typeof total === "number" && onMove;
    return (
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex min-w-0 items-center gap-2">
                {onDragStart ? (
                    <span
                        draggable
                        onDragStart={onDragStart}
                        className="cursor-grab touch-none rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600 active:cursor-grabbing"
                        title="Seret untuk mengurutkan"
                        aria-label="Seret untuk mengurutkan"
                    >
                        <IconGripVertical size={16} />
                    </span>
                ) : null}
                <div className="truncate text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    {title}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
                {showReorder ? (
                    <>
                        <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent bg-white text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            onClick={() => onMove(index, index - 1)}
                            disabled={index <= 0}
                            aria-label="Pindah ke atas"
                            title="Pindah ke atas"
                        >
                            <IconChevronUp size={16} />
                        </button>
                        <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent bg-white text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            onClick={() => onMove(index, index + 1)}
                            disabled={index >= total - 1}
                            aria-label="Pindah ke bawah"
                            title="Pindah ke bawah"
                        >
                            <IconChevronDown size={16} />
                        </button>
                    </>
                ) : null}
                <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors border border-transparent hover:border-red-100"
                    onClick={onRemove}
                    aria-label="Hapus"
                    title="Hapus Item"
                >
                    <IconX size={16} />
                </button>
            </div>
        </div>
    );
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Ya, lanjutkan",
    cancelLabel = "Batal",
    confirmClass = "bg-red-600 hover:bg-red-700",
    icon,
    singleButton = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onCancel?.();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="modal-pop relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="p-6 text-center">
                    {icon ? (
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                            {icon}
                        </div>
                    ) : null}
                    <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
                    {message ? (
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>
                    ) : null}
                    <div className={`mt-6 flex gap-2 ${singleButton ? "justify-center" : ""}`}>
                        {!singleButton ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
                            >
                                {cancelLabel}
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={onConfirm}
                            autoFocus
                            className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-white transition active:scale-[0.98] ${confirmClass}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
