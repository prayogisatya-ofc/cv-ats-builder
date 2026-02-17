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

            <Section title="PENDIDIKAN">
                {(cv.education || []).map((e, i) => (
                    <div key={i} className="mt-2">
                        <Row
                            leftTop={e.school}
                            leftSub={`${e.degree}${e.gpa ? ` | IPK: ${e.gpa}` : ""}`}
                            rightTop={e.location}
                            rightSub={`${e.start || ""} - ${e.end || ""}`}
                        />
                        {(e.highlights || []).length ? (
                            <ul className="ml-4 mt-1 list-disc">
                                {e.highlights.map((x, idx) => (
                                    <li key={idx}>{x}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </Section>

            <Section title="PENGALAMAN KERJA">
                {(cv.work || []).map((w, i) => (
                    <div key={i} className="mt-2">
                        <Row
                            leftTop={w.company}
                            leftSub={w.role}
                            rightTop={w.location}
                            rightSub={`${w.start || ""} - ${w.end || ""}`}
                        />
                        {(w.bullets || []).length ? (
                            <ul className="ml-4 mt-1 list-disc">
                                {w.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </Section>

            <Section title="PENGALAMAN MAGANG">
                {(cv.internship || []).map((w, i) => (
                    <div key={i} className="mt-2">
                        <Row
                            leftTop={w.company}
                            leftSub={w.role}
                            rightTop={w.location}
                            rightSub={`${w.start || ""} - ${w.end || ""}`}
                        />
                        {(w.bullets || []).length ? (
                            <ul className="ml-4 mt-1 list-disc">
                                {w.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </Section>

            <Section title="ORGANISASI">
                {(cv.organization || []).map((o, i) => (
                    <div key={i} className="mt-2">
                        <Row
                            leftTop={o.role}
                            leftSub={o.name}
                            rightTop={o.affiliation}
                            rightSub={`${o.start || ""} - ${o.end || ""}`}
                        />
                    </div>
                ))}
            </Section>

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

            <Section title="PENGHARGAAN">
                {(cv.awards || []).length ? (
                    <ul className="ml-4 mt-2 list-disc">
                        {cv.awards.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                ) : null}
            </Section>

            <Section title="SKILL">
                <div className="mt-2 space-y-1">
                    {(cv.skills?.soft || []).length ? (
                        <div>
                            <span className="font-semibold">Soft Skill: </span>
                            {(cv.skills.soft || []).join(", ")}
                        </div>
                    ) : null}
                    {(cv.skills?.hard || []).length ? (
                        <div>
                            <span className="font-semibold">Hard Skill: </span>
                            {(cv.skills.hard || []).join(", ")}
                        </div>
                    ) : null}
                    {(cv.skills?.tools || []).length ? (
                        <div>
                            <span className="font-semibold">Tools: </span>
                            {(cv.skills.tools || []).join(", ")}
                        </div>
                    ) : null}
                </div>
            </Section>

            <Section title="PENGALAMAN PROYEK">
                {(cv.projects || []).map((p, i) => (
                    <div key={i} className="mt-2">
                        <div className="text-[12.5px] font-bold">{p.name}</div>
                        {(p.bullets || []).length ? (
                            <ul className="ml-4 mt-1 list-disc">
                                {p.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </Section>
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
