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

const hasText = (v) => (v || "").toString().trim().length > 0;
const hasAny = (arr, predicate) => (arr || []).some(predicate);
const hasAnyBullet = (arr) => (arr || []).some((x) => hasText(x));

const showEducation = (cv) =>
    hasAny(cv.education, (e) =>
        hasText(e.school) || hasText(e.degree) || hasText(e.location) || hasText(e.gpa) || hasText(formatRange(e)) || hasAnyBullet(e.highlights)
    );

const showWork = (cv) =>
    hasAny(cv.work, (w) =>
        hasText(w.company) || hasText(w.role) || hasText(w.location) || hasText(formatRange(w)) || hasAnyBullet(w.bullets)
    );

const showIntern = (cv) =>
    hasAny(cv.internship, (w) =>
        hasText(w.company) || hasText(w.role) || hasText(w.location) || hasText(formatRange(w)) || hasAnyBullet(w.bullets)
    );

const showOrg = (cv) =>
    hasAny(cv.organization, (o) =>
        hasText(o.role) || hasText(o.name) || hasText(o.affiliation) || hasText(formatRange(o))
    );

const showCert = (cv) =>
    hasAny(cv.certification, (c) =>
        hasText(c.name) || hasText(c.issuer) || hasText(c.number) || hasText(c.year)
    );

const showAwards = (cv) => hasAnyBullet(cv.awards);

const showSkills = (cv) =>
    hasText(cv.skills?.soft) || hasText(cv.skills?.hard) || hasText(cv.skills?.tools);

const showProjects = (cv) =>
    hasAny(cv.projects, (p) => hasText(p.name) || hasAnyBullet(p.bullets));


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
            {showEducation(cv) ? (
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
            ) : null}

            {/* PENGALAMAN KERJA */}
            {showWork(cv) ? (
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
            ) : null}

            {/* PENGALAMAN MAGANG */}
            {showIntern(cv) ? (
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
            ) : null}

            {/* ORGANISASI */}
            {showOrg(cv) ? (
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
            ) : null}

            {/* <div className="page-break" /> */}

            {/* SERTIFIKASI */}
            {showCert(cv) ? (
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
            ) : null}

            {/* PENGHARGAAN */}
            {showAwards(cv) ? (
                <Section title="PENGHARGAAN">
                    <ul style={{ marginTop: 6 }}>
                        {(cv.awards || []).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </Section>
            ) : null}

            {/* SKILL */}
            {showSkills(cv) ? (
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
            ) : null}

            {/* PENGALAMAN PROYEK */}
            {showProjects(cv) ? (
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
            ) : null}
        </div>
    );
}
