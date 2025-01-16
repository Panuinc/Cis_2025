// components/FormPersonalRequestPdf.js

import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function exportPdf(item, getFullName) {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);  // ลงทะเบียน fontkit

    // โหลดฟอนต์ภาษาไทยจาก URL ที่เราเตรียมไว้
    const fontUrl = '/fonts/NotoSansThai-Regular.ttf'; 
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const fontSize = 12;
    let y = height - 50; 

    // ใช้ฟอนต์ภาษาไทยในการวาดข้อความ
    page.drawText(`รหัสเอกสาร ID: ${item.personalRequestDocumentId}`, {
      x: 50,
      y,
      size: fontSize,
      font: thaiFont,
    });
    y -= 20;
    page.drawText(`Status: ${item.personalRequestStatus}`, {
      x: 50,
      y,
      size: fontSize,
      font: thaiFont,
    });
    y -= 20;
    page.drawText(`Created By: ${getFullName(item.PersonalRequestCreateBy) || '-'}`, {
      x: 50,
      y,
      size: fontSize,
      font: thaiFont,
    });
    y -= 20;
    page.drawText(`Created At: ${new Date(item.personalRequestCreateAt).toLocaleString() || '-'}`, {
      x: 50,
      y,
      size: fontSize,
      font: thaiFont,
    });
    y -= 20;
    page.drawText(`Updated By: ${getFullName(item.PersonalRequestUpdateBy) || '-'}`, {
      x: 50,
      y,
      size: fontSize,
      font: thaiFont,
    });
    y -= 20;
    page.drawText(
      `Updated At: ${item.personalRequestUpdateAt ? new Date(item.personalRequestUpdateAt).toLocaleString() : '-'}`,
      { x: 50, y, size: fontSize, font: thaiFont }
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // เปิด PDF ในแท็บใหม่เพื่อดูตัวอย่าง
    window.open(url, '_blank');

    // หมายเหตุ: ไม่รีโคลพอ object URL ทันที เพื่อให้ PDF แสดงผลได้อย่างสมบูรณ์
    // URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PDF");
  }
}
