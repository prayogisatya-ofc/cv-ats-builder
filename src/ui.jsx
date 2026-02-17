import { IconChevronDown, IconX } from "@tabler/icons-react";

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

export function ItemHeader({ title, onRemove }) {
    return (
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                {title}
            </div>
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
    );
}
