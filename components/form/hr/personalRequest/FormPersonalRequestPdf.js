import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export async function exportPdf(item, getFullName) {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontUrl = "/fonts/NotoSansThai-Regular.ttf";
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    const imageUrl = "/images/company_logo/company_logo.png";
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(imageBytes);
    const imageDims = pngImage.scale(0.5);

    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    let y = height - 50;

    page.drawImage(pngImage, {
      x: 50,
      y: height - imageDims.height - 20,
      width: imageDims.width,
      height: imageDims.height,
    });

    page.drawText("ใบขออัตรากำลังคน : Personnel Request", {
      x: width / 2 - 120,
      y: height - 40 - imageDims.height,
      size: 16,
      font: thaiFont,
    });

    
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
    page.drawText(
      `Created By: ${getFullName(item.PersonalRequestCreateBy) || "-"}`,
      {
        x: 50,
        y,
        size: fontSize,
        font: thaiFont,
      }
    );
    y -= 20;
    page.drawText(
      `Created At: ${
        new Date(item.personalRequestCreateAt).toLocaleString() || "-"
      }`,
      {
        x: 50,
        y,
        size: fontSize,
        font: thaiFont,
      }
    );
    y -= 20;
    page.drawText(
      `Updated By: ${getFullName(item.PersonalRequestUpdateBy) || "-"}`,
      {
        x: 50,
        y,
        size: fontSize,
        font: thaiFont,
      }
    );
    y -= 20;
    page.drawText(
      `Updated At: ${
        item.personalRequestUpdateAt
          ? new Date(item.personalRequestUpdateAt).toLocaleString()
          : "-"
      }`,
      { x: 50, y, size: fontSize, font: thaiFont }
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PDF");
  }
}
