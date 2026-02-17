function Section({ title, children, className = "" }) {
    return (
        <div className={`section ${className}`}>
            <div className="section-title">{title}</div>
            <div className="section-line" />
            <div>{children}</div>
        </div>
    );
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
                                <div style={{ fontSize: 12 }}>{e.start} - {e.end}</div>
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
                                <div style={{ fontSize: 12 }}>{w.start} - {w.end}</div>
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
                                <div style={{ fontSize: 12 }}>{w.start} - {w.end}</div>
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
                                <div className="meta">{o.affiliation || "Universitas Teknokrat Indonesia"}</div>
                                <div style={{ fontSize: 12 }}>{o.start} - {o.end}</div>
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
                        <div className="skill-value">{(cv.skills?.soft || []).join(", ")}</div>
                    </div>
                    <div className="skill-row">
                        <div className="skill-label">Hard Skill</div>
                        <div className="skill-value">{(cv.skills?.hard || []).join(", ")}</div>
                    </div>
                    <div className="skill-row">
                        <div className="skill-label">Software Skill</div>
                        <div className="skill-value">{(cv.skills?.tools || []).join(", ")}</div>
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
