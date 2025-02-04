import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import prisma from "@/lib/prisma";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { getRequestIP } from "@/lib/GetRequestIp";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    // รับค่าจาก parameter (ต้องส่ง cvTHId มาใน url)
    const params = await context.params;
    const cvTHId = parseInt(params.cvTHId, 10);

    if (!cvTHId) {
      return NextResponse.json(
        { error: "CVTH ID is required" },
        { status: 400 }
      );
    }

    // ตรวจสอบ secret token และ rate limit
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // ดึงข้อมูลจากโมเดล CvTH พร้อมความสัมพันธ์ที่เกี่ยวข้อง
    const cvth = await prisma.cvTH.findUnique({
      where: { cvTHId: cvTHId },
      include: {
        CvTHEmployeeBy: true,
        CvTHEducation: true,
        CvTHLicense: true,
        CvTHWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvTHLanguageSkill: true,
        CvTHCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvTHUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!cvth) {
      return NextResponse.json(
        { error: "No CvTH data found" },
        { status: 404 }
      );
    }

    // Format วันที่สร้าง (สามารถปรับปรุงเพิ่มเติมได้ตามต้องการ)
    const formattedCreateAt = cvth.cvTHCreateAt
      ? new Date(cvth.cvTHCreateAt).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })
      : "-";

    // สร้างแถวสำหรับตารางการศึกษา
    const educationRows =
      cvth.CvTHEducation && cvth.CvTHEducation.length > 0
        ? cvth.CvTHEducation.map(
            (edu, index) => `
        <tr>
          <td class="border px-4 py-2 text-center">${index + 1}</td>
          <td class="border px-4 py-2">${edu.cvTHEducationDegree || "-"}</td>
          <td class="border px-4 py-2">${
            edu.cvTHEducationInstitution || "-"
          }</td>
          <td class="border px-4 py-2">${edu.cvTHEducationStartDate || "-"}</td>
          <td class="border px-4 py-2">${edu.cvTHEducationEndDate || "-"}</td>
        </tr>
      `
          ).join("")
        : `
        <tr>
          <td class="border px-4 py-2 text-center" colspan="5">ไม่มีข้อมูล</td>
        </tr>
      `;

    // สร้างแถวสำหรับตารางใบอนุญาตวิชาชีพ
    const licenseRows =
      cvth.CvTHLicense && cvth.CvTHLicense.length > 0
        ? cvth.CvTHLicense.map(
            (lic, index) => `
        <tr>
          <td class="border px-4 py-2 text-center">${index + 1}</td>
          <td class="border px-4 py-2">${
            lic.cvTHProfessionalLicenseName || "-"
          }</td>
          <td class="border px-4 py-2">${
            lic.cvTHProfessionalLicenseNumber || "-"
          }</td>
          <td class="border px-4 py-2">${
            lic.cvTHProfessionalLicenseStartDate || "-"
          }</td>
          <td class="border px-4 py-2">${
            lic.cvTHProfessionalLicenseEndDate || "-"
          }</td>
        </tr>
      `
          ).join("")
        : `
        <tr>
          <td class="border px-4 py-2 text-center" colspan="5">ไม่มีข้อมูล</td>
        </tr>
      `;

    // สร้างแถวสำหรับตารางประวัติการทำงาน (รวมโปรเจ็คที่เกี่ยวข้อง)
    const workHistoryRows =
      cvth.CvTHWorkHistory && cvth.CvTHWorkHistory.length > 0
        ? cvth.CvTHWorkHistory.map((wh, index) => {
            const projectList =
              wh.projects && wh.projects.length > 0
                ? wh.projects.map((proj) => proj.cvTHProjectName).join(", ")
                : "-";
            return `
          <tr>
            <td class="border px-4 py-2 text-center">${index + 1}</td>
            <td class="border px-4 py-2">${
              wh.cvTHWorkHistoryCompanyName || "-"
            }</td>
            <td class="border px-4 py-2">${
              wh.cvTHWorkHistoryPosition || "-"
            }</td>
            <td class="border px-4 py-2">${
              wh.cvTHWorkHistoryStartDate || "-"
            }</td>
            <td class="border px-4 py-2">${
              wh.cvTHWorkHistoryEndDate || "-"
            }</td>
            <td class="border px-4 py-2">${projectList}</td>
          </tr>
        `;
          }).join("")
        : `
          <tr>
            <td class="border px-4 py-2 text-center" colspan="6">ไม่มีข้อมูล</td>
          </tr>
        `;

    // สร้างแถวสำหรับตารางทักษะภาษา
    const languageRows =
      cvth.CvTHLanguageSkill && cvth.CvTHLanguageSkill.length > 0
        ? cvth.CvTHLanguageSkill.map(
            (lang, index) => `
          <tr>
            <td class="border px-4 py-2 text-center">${index + 1}</td>
            <td class="border px-4 py-2">${
              lang.cvTHLanguageSkillName || "-"
            }</td>
            <td class="border px-4 py-2">${
              lang.cvTHLanguageSkillProficiency || "-"
            }</td>
          </tr>
        `
          ).join("")
        : `
          <tr>
            <td class="border px-4 py-2 text-center" colspan="3">ไม่มีข้อมูล</td>
          </tr>
        `;

    // สร้าง HTML สำหรับ Export CvTH
    const htmlContent = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Sarabun', sans-serif;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.1);
            z-index: 1000;
            pointer-events: none;
          }
        </style>
      </head>
      <body class="p-8 text-sm">
        <div class="watermark">CV</div>
        <div class="text-center mb-4">
          <img src="${
            process.env.NEXT_PUBLIC_API_URL
          }/images/company_logo/company_logo.png" class="w-28 mx-auto" />
          <h1 class="text-3xl font-bold">ประวัติส่วนตัว (CV) ภาษาไทย</h1>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold">ข้อมูลพนักงาน</h2>
          <p>ชื่อ: ${
            cvth.CvTHEmployeeBy
              ? cvth.CvTHEmployeeBy.employeeFirstname +
                " " +
                cvth.CvTHEmployeeBy.employeeLastname
              : "-"
          }</p>
          <p>วันที่สร้าง: ${formattedCreateAt}</p>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold">ประวัติการศึกษา</h2>
          <table class="min-w-full border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="border px-4 py-2">ลำดับ</th>
                <th class="border px-4 py-2">ระดับการศึกษา</th>
                <th class="border px-4 py-2">สถาบัน</th>
                <th class="border px-4 py-2">เริ่ม</th>
                <th class="border px-4 py-2">จบ</th>
              </tr>
            </thead>
            <tbody>
              ${educationRows}
            </tbody>
          </table>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold">ใบอนุญาตวิชาชีพ</h2>
          <table class="min-w-full border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="border px-4 py-2">ลำดับ</th>
                <th class="border px-4 py-2">ชื่อใบอนุญาต</th>
                <th class="border px-4 py-2">หมายเลข</th>
                <th class="border px-4 py-2">เริ่ม</th>
                <th class="border px-4 py-2">จบ</th>
              </tr>
            </thead>
            <tbody>
              ${licenseRows}
            </tbody>
          </table>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold">ประวัติการทำงาน</h2>
          <table class="min-w-full border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="border px-4 py-2">ลำดับ</th>
                <th class="border px-4 py-2">บริษัท</th>
                <th class="border px-4 py-2">ตำแหน่ง</th>
                <th class="border px-4 py-2">เริ่ม</th>
                <th class="border px-4 py-2">จบ</th>
                <th class="border px-4 py-2">โปรเจ็คที่เกี่ยวข้อง</th>
              </tr>
            </thead>
            <tbody>
              ${workHistoryRows}
            </tbody>
          </table>
        </div>

        <div class="mb-4">
          <h2 class="text-xl font-semibold">ทักษะทางภาษา</h2>
          <table class="min-w-full border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="border px-4 py-2">ลำดับ</th>
                <th class="border px-4 py-2">ภาษา</th>
                <th class="border px-4 py-2">ระดับความสามารถ</th>
              </tr>
            </thead>
            <tbody>
              ${languageRows}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // สร้าง PDF โดยใช้ Puppeteer
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width: 100%; text-align: right; font-size: 10px; padding-right: 10px;">
          CV Export / Rev.01
        </div>
      `,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cvth_export_${cvTHId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
