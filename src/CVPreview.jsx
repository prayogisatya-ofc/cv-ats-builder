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

const hasText = (v) => (v || "").toString().trim().length > 0;

const hasAny = (arr, predicate) => (arr || []).some(predicate);

const hasAnyBullet = (arr) => {
  if (typeof arr === "string") return hasText(arr);
  return (arr || []).some((x) => hasText(x));
};

function DescBlock({ value, mode }) {
  const effectiveMode =
    mode === "text" || mode === "list"
      ? mode
      : typeof value === "string"
        ? "text"
        : "list";
  if (effectiveMode === "text") {
    const text = typeof value === "string" ? value : bulletsToTextPreview(value);
    if (!hasText(text)) return null;
    return (
      <div className="mt-1 whitespace-pre-line text-justify text-[12px] leading-[1.5]">
        {text.trim()}
      </div>
    );
  }
  const items = (
    Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.replace(/\r/g, "").split("\n")
        : []
  )
    .map((x) => (x || "").trim())
    .filter(Boolean);
  if (!items.length) return null;
  return (
    <ul className="ml-4 mt-1 list-disc text-[12px] leading-[1.5]">
      {items.map((x, idx) => (
        <li key={idx}>{x}</li>
      ))}
    </ul>
  );
}

function bulletsToTextPreview(arr) {
  if (typeof arr === "string") return arr;
  return (arr || []).join("\n");
}

const hasEducation = (cv) =>
  hasAny(cv.education, (e) =>
    hasText(e.school) ||
    hasText(e.degree) ||
    hasText(e.location) ||
    hasText(e.gpa) ||
    hasText(formatRange(e)) ||
    hasAnyBullet(e.highlights)
  );

const hasWork = (cv) =>
  hasAny(cv.work, (w) =>
    hasText(w.company) ||
    hasText(w.role) ||
    hasText(w.location) ||
    hasText(formatRange(w)) ||
    hasAnyBullet(w.bullets)
  );

const hasInternship = (cv) =>
  hasAny(cv.internship, (w) =>
    hasText(w.company) ||
    hasText(w.role) ||
    hasText(w.location) ||
    hasText(formatRange(w)) ||
    hasAnyBullet(w.bullets)
  );

const hasOrg = (cv) =>
  hasAny(cv.organization, (o) =>
    hasText(o.role) ||
    hasText(o.name) ||
    hasText(o.affiliation) ||
    hasText(formatRange(o))
  );

const hasCert = (cv) =>
  hasAny(cv.certification, (c) =>
    hasText(c.name) || hasText(c.issuer) || hasText(c.number) || hasText(c.year)
  );

const hasAwards = (cv) => hasAnyBullet(cv.awards);

const hasSkills = (cv) =>
  hasText(cv.skills?.soft) || hasText(cv.skills?.hard) || hasText(cv.skills?.tools);

const hasProjects = (cv) =>
  hasAny(cv.projects, (p) => hasText(p.name) || hasAnyBullet(p.bullets));

export default function CVPreview({ cv }) {
    const h = cv.header || {};
    return (
        <div className="bg-white p-10 font-serif text-[12px] text-slate-900">
            {/* Header */}
            <div className="text-center">
                <div className="text-[26px] font-bold tracking-[0.2px]">{h.name || "NAMA"}</div>
                <div className="mt-1 text-[12px]">
                    {[h.phone, h.email, h.linkedin, h.website].filter(Boolean).join(" | ")}
                </div>
                <div className="text-[12px]">{h.location}</div>
            </div>

            {/* Summary */}
            {cv.summary ? (
                <div className="mt-3 text-justify leading-[1.25]">{cv.summary}</div>
            ) : null}

            {hasEducation(cv) ? (
                <Section title="PENDIDIKAN">
                    {(cv.education || []).map((e, i) => (
                        <div key={i} className="mt-2">
                            <Row
                                leftTop={e.school}
                                leftSub={`${e.degree}${e.gpa ? ` | IPK: ${e.gpa}` : ""}`}
                                rightTop={e.location}
                                rightSub={formatRange(e)}
                            />
                            <DescBlock value={e.highlights} mode={e.highlightsMode} />
                        </div>
                    ))}
                </Section>
            ) : null}

            {hasWork(cv) ? (
                <Section title="PENGALAMAN KERJA">
                    {(cv.work || []).map((w, i) => (
                        <div key={i} className="mt-2">
                            <Row
                                leftTop={w.company}
                                leftSub={w.role}
                                rightTop={w.location}
                                rightSub={formatRange(w)}
                            />
                            <DescBlock value={w.bullets} mode={w.bulletsMode} />
                        </div>
                    ))}
                </Section>
            ) : null}

            {hasInternship(cv) ? (
                <Section title="PENGALAMAN MAGANG">
                    {(cv.internship || []).map((w, i) => (
                        <div key={i} className="mt-2">
                            <Row
                                leftTop={w.company}
                                leftSub={w.role}
                                rightTop={w.location}
                                rightSub={formatRange(w)}
                            />
                            <DescBlock value={w.bullets} mode={w.bulletsMode} />
                        </div>
                    ))}
                </Section>
            ) : null}

            {hasOrg(cv) ? (
                <Section title="ORGANISASI">
                    {(cv.organization || []).map((o, i) => (
                        <div key={i} className="mt-2">
                            <Row
                                leftTop={o.role}
                                leftSub={o.name}
                                rightTop={o.affiliation}
                                rightSub={formatRange(o)}
                            />
                        </div>
                    ))}
                </Section>
            ) : null}

            {hasCert(cv) ? (
                <Section title="SERTIFIKASI">
                    {(cv.certification || []).length ? (
                        <ul className="ml-4 mt-2 list-disc">
                            {cv.certification.map((c, i) => (
                                <li key={i}>
                                    {c.name}
                                    {c.issuer ? `, ${c.issuer}` : ""}
                                    {c.number ? `, Nomor: ${c.number}` : ""}
                                    {c.year ? `, ${c.year}` : ""}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </Section>
            ) : null}

            {hasAwards(cv) ? (
                <Section title="PENGHARGAAN">
                    {(cv.awards || []).length ? (
                        <ul className="ml-4 mt-2 list-disc">
                            {cv.awards.map((a, i) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                    ) : null}
                </Section>
            ) : null}

            {hasSkills(cv) ? (
                <Section title="SKILL">
                    <div className="mt-2 space-y-1">
                        {cv.skills?.soft ? (
                            <div>
                                <span className="font-semibold">Soft Skill: </span>
                                {cv.skills.soft}
                            </div>
                        ) : null}
                        {cv.skills?.hard ? (
                            <div>
                                <span className="font-semibold">Hard Skill: </span>
                                {cv.skills.hard}
                            </div>
                        ) : null}
                        {cv.skills?.tools ? (
                            <div>
                                <span className="font-semibold">Tools: </span>
                                {cv.skills.tools}
                            </div>
                        ) : null}
                    </div>
                </Section>
            ) : null}

            {hasProjects(cv) ? (
                <Section title="PENGALAMAN PROYEK">
                    {(cv.projects || []).map((p, i) => (
                        <div key={i} className="mt-2">
                            <div className="text-[12.5px] font-bold">{p.name}</div>
                            <DescBlock value={p.bullets} mode={p.bulletsMode} />
                        </div>
                    ))}
                </Section>
            ) : null}
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mt-4">
            <div className="text-[13px] font-bold uppercase">{title}</div>
            <div className="mt-1 border-t border-slate-900" />
            {children}
        </div>
    );
}

function Row({ leftTop, leftSub, rightTop, rightSub }) {
    return (
        <div className="flex items-baseline justify-between gap-6">
            <div className="min-w-0">
                <div className="text-[12.5px] font-bold">{leftTop}</div>
                {leftSub ? <div className="italic">{leftSub}</div> : null}
            </div>
            <div className="shrink-0 text-right">
                {rightTop ? <div className="font-bold">{rightTop}</div> : null}
                {rightSub ? <div>{rightSub}</div> : null}
            </div>
        </div>
    );
}
