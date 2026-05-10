import type { Appointment } from '../types';
import { formatDate, formatTime, getEndTime } from './helpers';

const TYPE_LABELS: Record<string, string> = {
  'in-clinic': 'In-Clinic Visit',
  'teleconsultation': 'Teleconsultation (Video)',
  'follow-up': 'Follow-up Visit',
  'urgent': 'Urgent Consultation',
};

export async function generateAppointmentPDF(
  appointment: Appointment,
  contact?: { phone: string; email: string; address: string }
): Promise<void> {
  const phone = contact?.phone ?? '+92-319-0539976';
  const email = contact?.email ?? 'contactahmad.services@gmail.com';
  const address = contact?.address ?? 'Islamabad Heart Institute, G-8/4, Islamabad';
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const C = {
      primary: [15, 76, 129] as [number, number, number],
      primaryDark: [10, 53, 96] as [number, number, number],
      light: [232, 244, 253] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      rowAlt: [245, 250, 255] as [number, number, number],
      amber: [255, 249, 230] as [number, number, number],
      amberBorder: [230, 190, 100] as [number, number, number],
      amberText: [146, 100, 10] as [number, number, number],
      textDark: [26, 39, 68] as [number, number, number],
      textMid: [90, 106, 133] as [number, number, number],
      textLight: [180, 210, 240] as [number, number, number],
      border: [212, 230, 245] as [number, number, number],
      accent: [0, 180, 216] as [number, number, number],
    };

    const W = 210;
    const HDR_H = 58;

    // ── Header background ─────────────────────────────────────
    doc.setFillColor(...C.primary);
    doc.rect(0, 0, W, HDR_H, 'F');
    doc.setFillColor(...C.primaryDark);
    doc.rect(0, HDR_H - 6, W, 6, 'F');

    // ── Doctor avatar ─────────────────────────────────────────
    const AV_X = 22, AV_Y = HDR_H / 2, AV_R = 16;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.circle(AV_X, AV_Y, AV_R + 2, 'S');
    doc.setFillColor(255, 255, 255);
    doc.circle(AV_X, AV_Y, AV_R, 'F');

    const drawAvatar = async () => {
      // 480px = ~300 DPI for 32mm circle — crisp output
      const PX = 480;
      const canvas = document.createElement('canvas');
      canvas.width = PX; canvas.height = PX;
      const ctx = canvas.getContext('2d')!;
      const drawCircle = (img: HTMLImageElement) => {
        ctx.clearRect(0, 0, PX, PX);
        ctx.beginPath();
        ctx.arc(PX / 2, PX / 2, PX / 2, 0, Math.PI * 2);
        ctx.closePath(); ctx.clip();
        const ratio = Math.max(PX / img.naturalWidth, PX / img.naturalHeight);
        const dw = img.naturalWidth * ratio, dh = img.naturalHeight * ratio;
        ctx.drawImage(img, (PX - dw) / 2, (PX - dh) / 2, dw, dh);
        return canvas.toDataURL('image/png');
      };
      try {
        const res = await fetch(window.location.origin + '/images/doctor-profile.jpg');
        if (!res.ok) throw new Error();
        const blobUrl = URL.createObjectURL(await res.blob());
        const b64 = await new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => { resolve(drawCircle(img)); URL.revokeObjectURL(blobUrl); };
          img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(); };
          img.src = blobUrl;
        });
        doc.addImage(b64, 'PNG', AV_X - AV_R, AV_Y - AV_R, AV_R * 2, AV_R * 2);
      } catch {
        doc.setFillColor(...C.primary);
        doc.circle(AV_X, AV_Y, AV_R, 'F');
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
        doc.text('SK', AV_X, AV_Y + 1.5, { align: 'center' });
        doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.textLight);
        doc.text('FCPS', AV_X, AV_Y + 7, { align: 'center' });
      }
    };
    await drawAvatar();

    doc.setDrawColor(255, 255, 255); doc.setLineWidth(1.2);
    doc.circle(AV_X, AV_Y, AV_R, 'S');

    // ── Doctor name ───────────────────────────────────────────
    const TX = AV_X + AV_R + 6;
    doc.setFontSize(17); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
    doc.text('Dr. Sarah Khan', TX, 20);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.textLight);
    doc.text('Interventional Cardiologist  ·  FCPS Cardiology', TX, 29);
    doc.text('Mayo Clinic Fellow  ·  PMDC: PM-35201-PKN', TX, 36);
    doc.setFontSize(8); doc.setTextColor(200, 225, 245);
    doc.text(address + '  ·  ' + phone, TX, 43);

    // ── CONFIRMED badge (canvas) — compact, crisp ─────────────
    // ── CONFIRMED badge (smaller, like first image) ─────────────
    const buildBadge = (): string => {
      const SCALE = 2.2;  // Kam scale = chota badge
      const BW = 200 * SCALE;
      const BH = 100 * SCALE;
      const bc = document.createElement('canvas');
      bc.width = BW;
      bc.height = BH;
      const bx = bc.getContext('2d')!;
      const r = 14 * SCALE;

      // Rounded rectangle with gradient
      bx.beginPath();
      bx.moveTo(r, 0);
      bx.lineTo(BW - r, 0);
      bx.quadraticCurveTo(BW, 0, BW, r);
      bx.lineTo(BW, BH - r);
      bx.quadraticCurveTo(BW, BH, BW - r, BH);
      bx.lineTo(r, BH);
      bx.quadraticCurveTo(0, BH, 0, BH - r);
      bx.lineTo(0, r);
      bx.quadraticCurveTo(0, 0, r, 0);
      bx.closePath();

      // Gradient background
      const g = bx.createLinearGradient(0, 0, 0, BH);
      g.addColorStop(0, '#27c163');
      g.addColorStop(1, '#1e9e4f');
      bx.fillStyle = g;
      bx.fill();

      // White circle background (chota circle)
      const CX = BW / 2;
      const CY = 34 * SCALE;
      const CR = 22 * SCALE;
      bx.beginPath();
      bx.arc(CX, CY, CR, 0, Math.PI * 2);
      bx.fillStyle = 'rgba(255,255,255,0.95)';
      bx.fill();

      // Green checkmark inside circle (chota checkmark)
      bx.beginPath();
      bx.moveTo(CX - 8 * SCALE, CY + 1 * SCALE);
      bx.lineTo(CX - 2 * SCALE, CY + 8 * SCALE);
      bx.lineTo(CX + 10 * SCALE, CY - 7 * SCALE);
      bx.strokeStyle = '#1e9e4f';
      bx.lineWidth = 4 * SCALE;
      bx.lineCap = 'round';
      bx.lineJoin = 'round';
      bx.stroke();

      // "CONFIRMED" text (chota)
      bx.fillStyle = '#ffffff';
      bx.font = `bold ${18 * SCALE}px Arial`;
      bx.textAlign = 'center';
      bx.textBaseline = 'middle';
      bx.fillText('CONFIRMED', BW / 2, 74 * SCALE);

      // Reference number (chota)
      bx.font = `${11 * SCALE}px Arial`;
      bx.fillStyle = 'rgba(255,255,255,0.85)';
      bx.fillText(appointment.referenceNumber, BW / 2, 94 * SCALE);

      return bc.toDataURL('image/png');
    };

    // PDF mein chota badge daalne ke liye
    doc.addImage(buildBadge(), 'PNG', W - 48, (HDR_H - 22) / 2, 44, 22);

    // ── Details card ──────────────────────────────────────────
    const rows = [
      { label: 'Patient Name', value: appointment.patientName },
      { label: 'Appointment Type', value: TYPE_LABELS[appointment.type] || appointment.type },
      { label: 'Date', value: formatDate(appointment.date) },
      { label: 'Time', value: `${formatTime(appointment.timeSlot)} – ${getEndTime(appointment.timeSlot)}` },
      { label: 'Location', value: 'Islamabad Heart Institute, G-8/4, Islamabad' },
      { label: 'Consultation Fee', value: `PKR ${appointment.fee.toLocaleString()}` },
      { label: 'Phone', value: appointment.phone },
      { label: 'Email', value: appointment.email || 'Not provided' },
      { label: 'Patient Type', value: appointment.patientType === 'new' ? 'New Patient' : 'Returning Patient' },
    ];

    const ROW_H = 13, CARD_T = 65, CARD_PL = 15, CARD_W = 180, HDR_ROW = 12;
    const CARD_H = HDR_ROW + rows.length * ROW_H + 6;

    doc.setFillColor(...C.light); doc.setDrawColor(...C.border); doc.setLineWidth(0.4);
    doc.roundedRect(CARD_PL, CARD_T, CARD_W, CARD_H, 3, 3, 'FD');
    doc.setFillColor(...C.primary);
    doc.roundedRect(CARD_PL, CARD_T, CARD_W, HDR_ROW, 3, 3, 'F');
    doc.rect(CARD_PL, CARD_T + 6, CARD_W, 6, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
    doc.text('APPOINTMENT DETAILS', CARD_PL + 6, CARD_T + 8.5);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.text(`Ref: ${appointment.referenceNumber}`, CARD_PL + CARD_W - 5, CARD_T + 8.5, { align: 'right' });

    let rY = CARD_T + HDR_ROW;
    rows.forEach((row, idx) => {
      doc.setFillColor(...(idx % 2 === 0 ? C.white : C.rowAlt));
      doc.rect(CARD_PL + 0.5, rY, CARD_W - 1, ROW_H, 'F');
      doc.setDrawColor(...C.border); doc.setLineWidth(0.2);
      doc.line(CARD_PL + 1, rY + ROW_H, CARD_PL + CARD_W - 1, rY + ROW_H);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.textMid);
      doc.text(row.label.toUpperCase(), CARD_PL + 6, rY + 8.5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.textDark);
      const v = doc.splitTextToSize(row.value, CARD_W - 68 - 8)[0];
      doc.text(v, CARD_PL + 68, rY + 8.5);
      rY += ROW_H;
    });

    let nextY = CARD_T + CARD_H + 5;

    if (appointment.type === 'teleconsultation') {
      doc.setFillColor(...C.accent);
      doc.roundedRect(CARD_PL, nextY, CARD_W, 12, 2, 2, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
      doc.text(`Video call link → ${appointment.email || appointment.phone}`, CARD_PL + 5, nextY + 8);
      nextY += 17;
    }

    // ── Before Your Visit ─────────────────────────────────────
    const instructions = [
      'Arrive 15 minutes early to complete registration paperwork.',
      'Bring CNIC/Passport, all previous medical reports, and a full medication list.',
      appointment.hasReports
        ? 'Please bring the test reports/investigations you mentioned during booking.'
        : 'No reports were mentioned — bring any available medical history.',
      'To cancel or reschedule, please call at least 24 hours in advance.',
    ];
    const INST_H = 10 + instructions.length * 8 + 4;
    doc.setFillColor(...C.amber); doc.setDrawColor(...C.amberBorder); doc.setLineWidth(0.4);
    doc.roundedRect(CARD_PL, nextY, CARD_W, INST_H, 3, 3, 'FD');
    doc.setFillColor(...C.amberBorder);
    doc.roundedRect(CARD_PL, nextY, 3, INST_H, 1, 1, 'F');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.amberText);
    doc.text('BEFORE YOUR VISIT', CARD_PL + 7, nextY + 8);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...C.textDark);
    instructions.forEach((line, i) => doc.text(`•   ${line}`, CARD_PL + 7, nextY + 16 + i * 8));

    // ── Footer ────────────────────────────────────────────────
    doc.setFillColor(...C.primary);
    doc.rect(0, 272, W, 25, 'F');
    [
      { label: 'PHONE', value: phone, cx: 17 },
      { label: 'EMAIL', value: email, cx: 83 },
      { label: 'EMERGENCY', value: '1122 (Rescue)', cx: 149 },
    ].forEach(col => {
      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.textLight);
      doc.text(col.label, col.cx, 280);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(255, 255, 255); doc.setFontSize(8.5);
      doc.text(col.value, col.cx, 288);
    });
    doc.setFontSize(6); doc.setTextColor(...C.textMid);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-PK')}  —  Islamabad Heart Institute  —  Official appointment confirmation`,
      W / 2, 268, { align: 'center' }
    );

    doc.save(`${appointment.referenceNumber}-Confirmation.pdf`);

  } catch (err) {
    console.error('PDF failed:', err);
    const content = [
      'APPOINTMENT CONFIRMATION',
      `Reference: ${appointment.referenceNumber}`,
      `Patient:   ${appointment.patientName}`,
      `Date:      ${formatDate(appointment.date)}`,
      `Time:      ${formatTime(appointment.timeSlot)} – ${getEndTime(appointment.timeSlot)}`,
      `Type:      ${TYPE_LABELS[appointment.type]}`,
      `Location:  Islamabad Heart Institute, G-8/4, Islamabad`,
      `Fee:       PKR ${appointment.fee.toLocaleString()}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${appointment.referenceNumber}.txt`; a.click();
    URL.revokeObjectURL(url);
  }
}
