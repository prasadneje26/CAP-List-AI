// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/pdfGenerator.js
// ============================================================

const PDFDocument = require('pdfkit');

/**
 * Generate a complete CAP counseling report PDF.
 * Returns a Buffer.
 */
const generatePDF = (reportData) => {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const { student, predictions, summary, generatedAt } = reportData;

    // ── Color palette ─────────────────────────────────────────
    const PRIMARY   = '#1a56db';
    const DARK      = '#1e2a3a';
    const GRAY      = '#6b7280';
    const LIGHT_BG  = '#f3f4f6';
    const SUCCESS   = '#059669';
    const WARNING   = '#d97706';
    const DANGER    = '#dc2626';

    const classColor = (c) =>
      c === 'Dream' ? DANGER : c === 'Target' ? WARNING : SUCCESS;

    // ── Helper: horizontal rule ───────────────────────────────
    const hr = (y) => {
      doc.moveTo(50, y).lineTo(545, y).strokeColor('#e5e7eb').lineWidth(0.5).stroke();
    };

    // ── COVER PAGE ────────────────────────────────────────────
    doc.rect(0, 0, 595, 200).fill(PRIMARY);

    doc.fillColor('#ffffff')
      .fontSize(26).font('Helvetica-Bold')
      .text('AI College CAP', 50, 60)
      .text('Counseling Report', 50, 92);

    doc.fontSize(11).font('Helvetica')
      .text(`Generated: ${new Date(generatedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })}`, 50, 140)
      .text('Maharashtra Engineering Admissions', 50, 158);

    // ── Student Profile Section ───────────────────────────────
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Student Profile', 50, 220);
    hr(238);

    const profileFields = [
      ['Name',            student.name],
      ['Email',           student.email],
      ['Percentile',      `${student.percentile}%`],
      ['Exam Type',       student.exam_type],
      ['Category',        student.category],
      ['Gender',          student.gender || '—'],
      ['Home University', student.home_university || '—'],
      ['College Type',    student.college_type || 'Any'],
      ['Max Budget',      student.budget_max
                            ? `₹${Number(student.budget_max).toLocaleString('en-IN')}/yr`
                            : '—'],
      ['Branch Prefs',    (student.branch_preferences || []).join(', ') || '—'],
      ['Location Prefs',  (student.location_preferences || []).join(', ') || '—'],
    ];

    let y = 248;
    profileFields.forEach(([label, value], i) => {
      if (i % 2 === 0) doc.rect(50, y, 495, 20).fill(LIGHT_BG);
      doc.fillColor(GRAY).fontSize(9).font('Helvetica')
        .text(label, 55, y + 5);
      doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold')
        .text(String(value), 200, y + 5);
      y += 22;
    });

    // ── Summary Section ───────────────────────────────────────
    y += 10;
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Prediction Summary', 50, y);
    hr(y + 18);

    y += 28;
    const boxes = [
      { label: 'Total',  value: summary.total,  color: PRIMARY  },
      { label: 'Dream',  value: summary.dream,  color: DANGER   },
      { label: 'Target', value: summary.target, color: WARNING  },
      { label: 'Safe',   value: summary.safe,   color: SUCCESS  },
    ];

    boxes.forEach((box, i) => {
      const bx = 50 + i * 124;
      doc.rect(bx, y, 112, 56).fill(box.color);
      doc.fillColor('#ffffff')
        .fontSize(24).font('Helvetica-Bold')
        .text(String(box.value), bx + 8, y + 8, { width: 96, align: 'center' });
      doc.fontSize(10).font('Helvetica')
        .text(box.label, bx + 8, y + 36, { width: 96, align: 'center' });
    });

    // ── CAP Preference List ───────────────────────────────────
    y += 76;
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('CAP Preference List', 50, y);
    hr(y + 18);

    y += 28;

    // Table header
    doc.rect(50, y, 495, 20).fill(PRIMARY);
    doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
    doc.text('#',           54,  y + 6);
    doc.text('College',     72,  y + 6);
    doc.text('Branch',      240, y + 6);
    doc.text('Cutoff',      340, y + 6);
    doc.text('Prob %',      388, y + 6);
    doc.text('Type',        436, y + 6);
    doc.text('Fees (₹)',    475, y + 6);

    y += 22;

    predictions.forEach((p, i) => {
      // Page break
      if (y > 740) {
        doc.addPage();
        y = 50;
      }

      const rowBg = i % 2 === 0 ? '#ffffff' : LIGHT_BG;
      doc.rect(50, y, 495, 18).fill(rowBg);

      // Classification pill
      doc.rect(50, y, 4, 18).fill(classColor(p.classification));

      doc.fillColor(DARK).fontSize(7.5).font('Helvetica');
      doc.text(String(p.cap_order),  54,  y + 5);
      doc.text(p.college_name,       72,  y + 5, { width: 162, ellipsis: true });
      doc.text(p.branch,             240, y + 5, { width: 94,  ellipsis: true });
      doc.text(String(p.predicted_cutoff || '—'), 340, y + 5);
      doc.text(
        p.admission_probability ? `${p.admission_probability}%` : '—',
        388, y + 5
      );

      doc.fillColor(classColor(p.classification)).font('Helvetica-Bold')
        .text(p.classification, 436, y + 5);

      doc.fillColor(DARK).font('Helvetica')
        .text(
          p.annual_fees
            ? `${Math.round(p.annual_fees / 1000)}K`
            : '—',
          475, y + 5
        );

      y += 20;
    });

    // ── Strategy Tips ─────────────────────────────────────────
    if (y > 680) { doc.addPage(); y = 50; }

    y += 16;
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Strategy Tips', 50, y);
    hr(y + 18);

    y += 28;
    const tips = [
      'Fill all 30 CAP preference slots — leaving slots empty is a missed opportunity.',
      'Always put your Dream colleges first in the list. If allotted, you can cancel lower ones.',
      'Include at least 5 Safe colleges at the bottom of your list as a backup.',
      'Check seat availability before the final round — fill up that round well.',
      `Your category (${student.category}) opens additional reserved seats at every college.`,
      'Round 2 and Round 3 cutoffs often drop — monitor live updates on the official CAP portal.',
    ];

    tips.forEach((tip, i) => {
      if (y > 750) { doc.addPage(); y = 50; }
      doc.rect(50, y, 6, 14).fill(PRIMARY);
      doc.fillColor(DARK).fontSize(9).font('Helvetica')
        .text(`${i + 1}. ${tip}`, 64, y + 2, { width: 480 });
      y += 22;
    });

    // ── Footer ────────────────────────────────────────────────
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fillColor(GRAY).fontSize(8).font('Helvetica')
        .text(
          `AI CAP Counseling Platform  ·  Page ${i + 1} of ${pageCount}  ·  For guidance only`,
          50, 820, { align: 'center', width: 495 }
        );
    }

    doc.end();
  });
};

module.exports = { generatePDF };
