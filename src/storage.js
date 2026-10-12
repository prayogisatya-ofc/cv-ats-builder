const KEY = "cv_ats_builder_v1";

export function loadCV() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveCV(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function inferDescMode(value, modeField) {
    if (modeField === "list" || modeField === "text") return modeField;
    return typeof value === "string" ? "text" : "list";
}

// Pastikan setiap item deskripsi punya field mode eksplisit untuk export.
// Tidak mengubah value, hanya menambah mode bila belum ada.
export function injectDescModes(cv) {
    if (!cv || typeof cv !== "object") return cv;
    const withMode = (arr, valueKey, modeKey) =>
        (Array.isArray(arr) ? arr : []).map((item = {}) => ({
            ...item,
            [modeKey]: inferDescMode(item[valueKey], item[modeKey]),
        }));
    return {
        ...cv,
        education: Array.isArray(cv.education)
            ? withMode(cv.education, "highlights", "highlightsMode")
            : cv.education,
        work: Array.isArray(cv.work) ? withMode(cv.work, "bullets", "bulletsMode") : cv.work,
        internship: Array.isArray(cv.internship)
            ? withMode(cv.internship, "bullets", "bulletsMode")
            : cv.internship,
        projects: Array.isArray(cv.projects)
            ? withMode(cv.projects, "bullets", "bulletsMode")
            : cv.projects,
    };
}

export function exportJSON(data) {
    const withModes = injectDescModes(data);
    const blob = new Blob([JSON.stringify(withModes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-ats.json";
    a.click();
    URL.revokeObjectURL(url);
}

export function importJSONFile(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
            try { resolve(JSON.parse(String(r.result))); } catch (e) { reject(e); }
        };
        r.onerror = reject;
        r.readAsText(file);
    });
}

const asStr = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
const asBool = (v) => !!v;

// Deskripsi bisa array (mode list) atau string (mode teks) — keduanya valid.
const asStrArray = (v) => {
    if (!Array.isArray(v)) return [];
    return v.map((x) => (typeof x === "string" ? x : x == null ? "" : String(x)));
};

function normPeriod(src = {}) {
    return {
        startMonth: asStr(src.startMonth),
        startYear: asStr(src.startYear),
        endMonth: asStr(src.endMonth),
        endYear: asStr(src.endYear),
        isCurrent: asBool(src.isCurrent),
    };
}

// Normalisasi hasil import agar tahan format lama (bullets array saja)
// maupun format baru (bullets string/array + mode eksplisit) + jaga urutan array.
export function normalizeCV(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        throw new Error("Format JSON tidak valid");
    }
    const h = raw.header || {};
    const s = raw.skills || {};

    const normDesc = (v, modeField) => {
        const mode = inferDescMode(v, modeField);
        if (mode === "text") {
            if (typeof v === "string") return { value: v, mode };
            if (Array.isArray(v))
                return {
                    value: v
                        .map((x) => (typeof x === "string" ? x : x == null ? "" : String(x)))
                        .join("\n"),
                    mode,
                };
            return { value: "", mode };
        }
        if (typeof v === "string") {
            if (!v) return { value: [], mode };
            return {
                value: v
                    .replace(/\r/g, "")
                    .split("\n")
                    .map((line) => line.replace(/\t/g, " ")),
                mode,
            };
        }
        if (Array.isArray(v))
            return {
                value: v.map((x) => (typeof x === "string" ? x : x == null ? "" : String(x))),
                mode,
            };
        return { value: [], mode };
    };

    return {
        header: {
            name: asStr(h.name),
            phone: asStr(h.phone),
            email: asStr(h.email),
            linkedin: asStr(h.linkedin),
            website: asStr(h.website),
            location: asStr(h.location),
        },
        summary: asStr(raw.summary),
        education: (Array.isArray(raw.education) ? raw.education : []).map((e = {}) => {
            const { value, mode } = normDesc(
                e.highlights ?? e.bullets ?? [],
                e.highlightsMode ?? e.bulletsMode
            );
            return {
                school: asStr(e.school),
                degree: asStr(e.degree),
                location: asStr(e.location),
                gpa: asStr(e.gpa),
                ...normPeriod(e),
                highlights: value,
                highlightsMode: mode,
            };
        }),
        work: (Array.isArray(raw.work) ? raw.work : []).map((w = {}) => {
            const { value, mode } = normDesc(
                w.bullets ?? w.highlights ?? [],
                w.bulletsMode ?? w.highlightsMode
            );
            return {
                company: asStr(w.company),
                role: asStr(w.role),
                location: asStr(w.location),
                ...normPeriod(w),
                bullets: value,
                bulletsMode: mode,
            };
        }),
        internship: (Array.isArray(raw.internship) ? raw.internship : []).map((w = {}) => {
            const { value, mode } = normDesc(w.bullets ?? [], w.bulletsMode);
            return {
                company: asStr(w.company),
                role: asStr(w.role),
                location: asStr(w.location),
                ...normPeriod(w),
                bullets: value,
                bulletsMode: mode,
            };
        }),
        organization: (Array.isArray(raw.organization) ? raw.organization : []).map((o = {}) => ({
            name: asStr(o.name),
            role: asStr(o.role),
            affiliation: asStr(o.affiliation),
            ...normPeriod(o),
        })),
        certification: (Array.isArray(raw.certification) ? raw.certification : []).map((c = {}) => ({
            name: asStr(c.name),
            issuer: asStr(c.issuer),
            number: asStr(c.number),
            year: asStr(c.year),
        })),
        awards: asStrArray(raw.awards),
        skills: {
            soft: asStr(s.soft),
            hard: asStr(s.hard),
            tools: asStr(s.tools),
        },
        projects: (Array.isArray(raw.projects) ? raw.projects : []).map((p = {}) => {
            const { value, mode } = normDesc(p.bullets ?? p.description ?? [], p.bulletsMode);
            return {
                name: asStr(p.name),
                bullets: value,
                bulletsMode: mode,
            };
        }),
    };
}
