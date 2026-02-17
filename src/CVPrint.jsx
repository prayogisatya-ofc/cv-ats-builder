function Section({ title, children, className = "" }) {
    return (
        <div className={`section ${className}`}>
            <div className="section-title">{title}</div>
            <div className="section-line" />
            <div>{children}</div>
        </div>
    );
}

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

export function CVPrint({ cv }) {
    const h = cv.header || {};

    return (
        <div>
            {/* HEADER */}
            <div className="name">{h.name}</div>
            <div className="contact">
                <span>{h.phone}</span> | <span>{h.email}</span> | <span>{h.linkedin}</span> | <span>{h.website}</span>
            </div>
            <div className="location">{h.location}</div>

            {/* SUMMARY */}
            <div className="summary">{cv.summary}</div>

            {/* PENDIDIKAN */}
            <Section title="PENDIDIKAN">
                {(cv.education || []).map((e, i) => (
                    <div className="avoid-break" key={i} style={{ marginTop: i === 0 ? 6 : 10 }}>
                        <div className="row">
                            <div className="left">
                                <div className="item-title">{e.school}</div>
                                <div className="item-sub">
                                    {e.degree} | IPK: {e.gpa}
                                </div>
                            </div>
                            <div className="right">
                                <div className="meta">{e.location}</div>
                                <div style={{ fontSize: 12 }}>{formatRange(e)}</div>
                            </div>
                        </div>
                        <ul>
                            {(e.highlights || []).map((x, idx) => <li key={idx}>{x}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            {/* PENGALAMAN KERJA */}
            <Section title="PENGALAMAN KERJA">
                {(cv.work || []).map((w, i) => (
                    <div className="avoid-break" key={i} style={{ marginTop: i === 0 ? 6 : 10 }}>
                        <div className="row">
                            <div className="left">
                                <div className="item-title">{w.company}</div>
                                <div className="item-sub">{w.role}</div>
                            </div>
                            <div className="right">
                                <div className="meta">{w.location}</div>
                                <div style={{ fontSize: 12 }}>{formatRange(w)}</div>
                            </div>
                        </div>
                        <ul>
                            {(w.bullets || []).map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            {/* PENGALAMAN MAGANG */}
            <Section title="PENGALAMAN MAGANG">
                {(cv.internship || []).map((w, i) => (
                    <div className="avoid-break" key={i} style={{ marginTop: i === 0 ? 6 : 10 }}>
                        <div className="row">
                            <div className="left">
                                <div className="item-title">{w.company}</div>
                                <div className="item-sub">{w.role}</div>
                            </div>
                            <div className="right">
                                <div className="meta">{w.location}</div>
                                <div style={{ fontSize: 12 }}>{formatRange(w)}</div>
                            </div>
                        </div>
                        <ul>
                            {(w.bullets || []).map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            {/* ORGANISASI */}
            <Section title="ORGANISASI">
                {(cv.organization || []).map((o, i) => (
                    <div className="avoid-break" key={i} style={{ marginTop: i === 0 ? 6 : 10 }}>
                        <div className="row">
                            <div className="left">
                                <div className="org-left-top">{o.role}</div>
                                <div className="org-left-sub">{o.name}</div>
                            </div>
                            <div className="right">
                                <div className="meta">{o.affiliation}</div>
                                <div style={{ fontSize: 12 }}>{formatRange(o)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </Section>

            {/* <div className="page-break" /> */}

            {/* SERTIFIKASI */}
            <Section title="SERTIFIKASI">
                <ul style={{ marginTop: 6 }}>
                    {(cv.certification || []).map((c, i) => (
                        <li key={i}>
                            {c.name}, {c.issuer}
                            {c.number ? `, Nomor: ${c.number}` : ""}
                            {c.year ? `, ${c.year}` : ""}
                        </li>
                    ))}
                </ul>
            </Section>

            {/* PENGHARGAAN */}
            <Section title="PENGHARGAAN">
                <ul style={{ marginTop: 6 }}>
                    {(cv.awards || []).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            </Section>

            {/* SKILL */}
            <Section title="SKILL">
                <div className="skill-grid">
                    <div className="skill-row">
                        <div className="skill-label">Soft Skill</div>
                        <div className="skill-value">{cv.skills?.soft}</div>
                    </div>
                    <div className="skill-row">
                        <div className="skill-label">Hard Skill</div>
                        <div className="skill-value">{cv.skills?.hard}</div>
                    </div>
                    <div className="skill-row">
                        <div className="skill-label">Software Skill</div>
                        <div className="skill-value">{cv.skills?.tools}</div>
                    </div>
                </div>
            </Section>

            {/* PENGALAMAN PROYEK */}
            <Section title="PENGALAMAN PROYEK">
                {(cv.projects || []).map((p, i) => (
                    <div className="avoid-break" key={i} style={{ marginTop: i === 0 ? 6 : 10 }}>
                        <div className="item-title">{p.name}</div>
                        <ul>
                            {(p.bullets || []).map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>
        </div>
    );
}
