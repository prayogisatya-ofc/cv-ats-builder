export function printHtmlToPdf({ title = "CV ATS", html }) {
    const w = window.open("", "_blank");
    if (!w) {
        alert("Popup diblokir. Izinkan popups untuk export PDF.");
        return;
    }

    w.document.open();
    w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 10mm 10mm 10mm 10mm; }
    html, body { padding: 0; margin: 0; }
    body { font-family: "Times New Roman", Times, serif; color: #111; }

    .name { text-align: center; font-weight: 700; font-size: 26px; letter-spacing: .2px; }
    .contact { text-align: center; font-size: 12px; margin-top: 6px; }
    .contact span { margin: 0 6px; }
    .location { text-align: center; font-size: 12px; margin-top: 2px; }

    .summary { font-size: 12.5px; line-height: 1.25; margin-top: 10px; text-align: justify; }

    .section { margin-top: 14px; }
    .section-title { font-weight: 700; font-size: 13px; text-transform: uppercase; }
    .section-line { border-top: 1px solid #111; margin-top: 4px; }

    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .left { flex: 1; min-width: 0; }
    .right { flex: 0 0 auto; text-align: right; white-space: nowrap; }

    .item-title { font-weight: 700; font-size: 12.5px; }
    .item-sub { font-style: italic; font-size: 12px; margin-top: 1px; }
    .meta { font-size: 12px; font-weight: 700; }

    ul { margin: 4px 0 0 18px; padding: 0; font-size: 12px; }
    li { margin: 1px 0; }

    .org-left-top { font-weight: 700; font-size: 12.5px; }
    .org-left-sub { font-style: italic; font-size: 12px; margin-top: 1px; }

    .skill-grid { margin-top: 6px; font-size: 12px; }
    .skill-row { display: grid; grid-template-columns: 90px 1fr; gap: 18px; margin: 2px 0; }
    .skill-label { font-weight: 400; }
    .skill-value { }

    .page-break { break-before: page; page-break-before: always; }

    .avoid-break { break-inside: avoid; page-break-inside: avoid; }

    @media print {
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  ${html}
  <script>
    window.onload = () => {
      window.focus();
      window.print();
      window.close();
    };
  </script>
</body>
</html>`);
    w.document.close();
}
