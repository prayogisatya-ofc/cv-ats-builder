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

export function exportJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
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
