const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

function buildPdfBuffer({ studentData, capList, aiStrategy = '' }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const bufferChunks = [];
    const stream = new PassThrough();

    doc.pipe(stream);
    stream.on('data', (chunk) => bufferChunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(bufferChunks)));
    stream.on('error', reject);

    doc.fillColor('#0f3460').fontSize(24).text('CAP Advisor Report', { align: 'center' });
    doc.moveDown();
    doc.fillColor('#ffffff').rect(40, doc.y, 515, 110).fill('#0f3460');
    doc.fillColor('#ffffff').fontSize(12).text(`Name: ${studentData.name || 'Student'}`, 50, doc.y + 10);
    doc.text(`Percentile: ${studentData.percentile}`, { continued: true }).text(`   Category: ${studentData.category}`);
    doc.text(`Preferred branches: ${studentData.branches?.join(', ') || 'N/A'}`);
    doc.text(`Location: ${studentData.location || 'Any'}   College Type: ${studentData.collegeType || 'Any'}`);
    doc.moveDown(2);

    const dreamCount = capList.filter((item) => item.classification === 'Dream').length;
    const targetCount = capList.filter((item) => item.classification === 'Target').length;
    const safeCount = capList.filter((item) => item.classification === 'Safe').length;

    doc.fillColor('#000000').fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total preferences: ${capList.length}`);
    doc.text(`Dream: ${dreamCount}   Target: ${targetCount}   Safe: ${safeCount}`);
    doc.moveDown();

    doc.fillColor('#0f3460').fontSize(14).text('AI Strategy', { underline: true });
    doc.fontSize(11).fillColor('#333333').text(aiStrategy || 'No strategy available.', { align: 'justify' });
    doc.addPage();

    doc.fillColor('#0f3460').fontSize(18).text('CAP Preference List', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const columnWidths = {
      rank: 40,
      college: 160,
      branch: 120,
      cutoff: 70,
      probability: 70,
      type: 70
    };

    doc.fontSize(10).fillColor('#ffffff').rect(40, tableTop, 515, 20).fill('#0f3460');
    doc.fillColor('#ffffff').text('Rank', 45, tableTop + 5, { width: columnWidths.rank });
    doc.text('College', 90, tableTop + 5, { width: columnWidths.college });
    doc.text('Branch', 255, tableTop + 5, { width: columnWidths.branch });
    doc.text('Cutoff', 375, tableTop + 5, { width: columnWidths.cutoff });
    doc.text('Chance', 445, tableTop + 5, { width: columnWidths.probability });
    doc.text('Type', 515, tableTop + 5, { width: columnWidths.type });

    let y = tableTop + 25;
    capList.forEach((item, index) => {
      if (y > 720) {
        doc.addPage();
        y = 40;
      }
      const rowColor = item.classification === 'Dream' ? '#fee2e2' : item.classification === 'Target' ? '#fef3c7' : '#dcfce7';
      doc.rect(40, y - 2, 515, 22).fill(rowColor);
      doc.fillColor('#000000').text(item.capRank.toString(), 45, y, { width: columnWidths.rank });
      doc.text(item.collegeName, 90, y, { width: columnWidths.college });
      doc.text(item.branch, 255, y, { width: columnWidths.branch });
      doc.text(item.cutoff.toFixed(1), 375, y, { width: columnWidths.cutoff });
      doc.text(`${item.probability}%`, 445, y, { width: columnWidths.probability });
      doc.text(item.type, 515, y, { width: columnWidths.type });
      y += 24;
    });

    if (y + 120 > 780) {
      doc.addPage();
      y = 40;
    }

    doc.addPage();
    doc.fillColor('#0f3460').fontSize(16).text('10 CAP Strategy Tips', { underline: true });
    doc.moveDown();
    const tips = [
      'Balance Dream, Target, and Safe choices across your list.',
      'Choose branches that align with both interest and score potential.',
      'Use category-specific cutoffs to avoid overconfident choices.',
      'Include a mix of college locations to widen admission options.',
      'Keep at least 3 strong safe choices in the final list.',
      'Respect your category ranking and avoid forcing high-cutoff branches.',
      'Track recent cutoff trends for every branch you select.',
      'Give preference to accredited programs with strong placement ratings.',
      'Do not discount non-autonomous colleges with strong outcomes.',
      'Review your list before final submission and remove duplicates.'
    ];

    tips.forEach((tip, index) => {
      doc.fontSize(11).fillColor('#111827').text(`${index + 1}. ${tip}`, { paragraphGap: 4, lineGap: 2 });
    });

    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor('#6b7280').text(`Page ${i + 1} of ${pageCount}`, 40, 780, { align: 'center', width: 515 });
    }

    doc.end();
  });
}

module.exports = { buildPdfBuffer };
