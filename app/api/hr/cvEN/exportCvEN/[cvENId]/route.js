import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import prisma from "@/lib/prisma";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { getRequestIP } from "@/lib/GetRequestIp";
import fs from "fs";
import path from "path";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const cvENId = parseInt(params.cvENId, 10);

    if (!cvENId) {
      return NextResponse.json(
        { error: "CVEN ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cvth = await prisma.cvEN.findUnique({
      where: { cvENId: cvENId },
      include: {
        CvENEmployeeBy: {
          include: {
            employeeEmployment: {
              where: {
                employmentWorkStatus: "CurrentEmployee",
              },
              include: {
                EmploymentPositionId: {
                  select: { positionNameEN: true },
                },
              },
            },
          },
        },
        CvENEducation: true,
        CvENLicense: true,
        CvENWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvENLanguageSkill: true,
        CvENCreateBy: {
          select: { employeeFirstnameEN: true, employeeLastnameEN: true },
        },
        CvENUpdateBy: {
          select: { employeeFirstnameEN: true, employeeLastnameEN: true },
        },
      },
    });

    if (!cvth) {
      return NextResponse.json(
        { error: "No CvEN data found" },
        { status: 404 }
      );
    }

    const employmentPicture =
      cvth.CvENEmployeeBy?.employeeEmployment?.[0]?.employmentPicture ||
      "default.png";

    const fullname = cvth.CvENEmployeeBy
      ? `${cvth.CvENEmployeeBy.employeeFirstnameEN} ${cvth.CvENEmployeeBy.employeeLastnameEN}`
      : "-";

    const positionNameEN =
      cvth.CvENEmployeeBy?.employeeEmployment?.[0]?.EmploymentPositionId
        ?.positionNameEN || "-";

    const employeeEmail = cvth.CvENEmployeeBy?.employeeEmail || "-";

    const formattedBirthday = cvth.CvENEmployeeBy?.employeeBirthday
      ? new Date(cvth.CvENEmployeeBy.employeeBirthday).toLocaleDateString(
          "th-EN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )
      : "-";

    let workHistoryHtml = "";
    if (cvth.CvENWorkHistory && cvth.CvENWorkHistory.length > 0) {
      workHistoryHtml = cvth.CvENWorkHistory.map((wh) => {
        const projectsHtml =
          wh.projects && wh.projects.length > 0
            ? `
                <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
                  ${wh.projects
                    .map(
                      (proj) => `
                      <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
                        <span class="flex items-center justify-center h-full p-2 gap-2">●</span>
                        <span class="flex items-center justify-start w-full h-full p-2 gap-2">
                          ${proj.cvENProjectName} , ${proj.cvENProjectDescription}
                        </span>
                      </div>
                    `
                    )
                    .join("")}
                </div>
              `
            : '<div class="text-gray-500">No projects listed</div>';

        return `
            <div class="flex flex-col items-start justify-start w-full h-full p-2 gap-2">
              <div class="flex flex-col items-center justify-start w-full h-full p-2 gap-2">
                <b>${wh.cvENWorkHistoryCompanyName || ""}</b>
                <b>${wh.cvENWorkHistoryPosition || ""}</b>
                <b>${wh.cvENWorkHistoryStartDate || ""} - ${wh.cvENWorkHistoryEndDate || ""}</b>
              </div>
              <div class="flex flex-col items-center justify-center w-full h-full p-2 border-2border-l-2">
                ${projectsHtml}
              </div>
            </div>
          `;
      }).join("");
    } else {
      workHistoryHtml =
        '<div class="text-gray-500">No work experience data available</div>';
    }

    let educationHtml = "";
    if (cvth.CvENEducation && cvth.CvENEducation.length > 0) {
      educationHtml = cvth.CvENEducation.map((edu) => {
        return `
          <div class="flex flex-col items-start w-full h-full">
            <span>${edu.cvENEducationDegree || "-"} ${
          edu.cvENEducationStartDate || "-"
        }</span>
            <span>${edu.cvENEducationInstitution || "-"}</span>
          </div>
        `;
      }).join("");
    } else {
      educationHtml = '<div class="text-gray-500">No Educations found</div>';
    }

    let licenseHtml = "";
    if (cvth.CvENLicense && cvth.CvENLicense.length > 0) {
      licenseHtml = cvth.CvENLicense.map((lic) => {
        return `
          <div class="flex flex-row items justify-between w-full h-full">
            <span> ${lic.cvENProfessionalLicenseName || "-"} , </span>
            <span> ${lic.cvENProfessionalLicenseNumber || "-"}</span>          
          </div>
        `;
      }).join("");
    } else {
      licenseHtml = '<div class="text-gray-500">No License data</div>';
    }

    let languageSkillHtml = "";
    if (cvth.CvENLanguageSkill && cvth.CvENLanguageSkill.length > 0) {
      languageSkillHtml = cvth.CvENLanguageSkill.map((lang) => {
        return `
          <div class="flex flex-row items-center justify-between w-full h-full">
            <span> ${lang.cvENLanguageSkillName || "-"} : </span>
            <span> ${lang.cvENLanguageSkillProficiency || "-"}</span>
          </div>
        `;
      }).join("");
    } else {
      languageSkillHtml =
        '<div class="text-gray-500">No language skills data</div>';
    }

    const hrIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="9" r="2"></circle>
          <path d="M13 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z"></path>
          <path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12Z"></path>
          <path strokeLinecap="round" d="M19 12h-4m4-3h-5m5 6h-3"></path>
        </g>
      </svg>
    `;

    const emailIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M10.5 22v-2m4 2v-2"/>
          <path fill="currentColor" d="M11 20v.75h.75V20zm3-.75a.75.75 0 0 0 0 1.5zm3.5-14a.75.75 0 0 0 0 1.5zM7 5.25a.75.75 0 0 0 0 1.5zm2 14a.75.75 0 0 0 0 1.5zm6 1.5a.75.75 0 0 0 0-1.5zm-4.75-9.5V20h1.5v-8.75zm.75 8H4.233v1.5H11zm-8.25-1.855V11.25h-1.5v6.145zm1.483 1.855c-.715 0-1.483-.718-1.483-1.855h-1.5c0 1.74 1.231 3.355 2.983 3.355zM6.5 6.75c1.967 0 3.75 1.902 3.75 4.5h1.5c0-3.201-2.246-6-5.25-6zm0-1.5c-3.004 0-5.25 2.799-5.25 6h1.5c0-2.598 1.783-4.5 3.75-4.5zm14.75 6v6.175h1.5V11.25zm-1.457 8H14v1.5h5.793zm1.457-1.825c0 1.12-.757 1.825-1.457 1.825v1.5c1.738 0 2.957-1.601 2.957-3.325zm1.5-6.175c0-3.201-2.246-6-5.25-6v1.5c1.967 0 3.75 1.902 3.75 4.5zM7 6.75h11v-1.5H7zm2 14h6v-1.5H9z"/>
        </g>
      </svg>
    `;

    const htmlContent = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @font-face {
            font-family: 'THSarabun';
            src: url('${process.env.NEXT_PUBLIC_API_URL}/fonts/THSarabunNew.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          body {
            font-family: 'THSarabun', sans-serif;
          }
          .bg-header {
            background: rgba(3, 153, 76);
          }
          .bg-default {
            background: rgba(239, 242, 240);
          }
          .text-blue {
            color: rgba(64,89,146);
            font-size: 39px;
          }
          .text-green {
            color: rgba(3, 153, 76);
            font-size: 18px;
          }
          .text-white {
            color: rgba(255,255,255);
            font-size: 20px;
          }
          .text-dark-header {
            color: rgba(0,0,0);
            font-size: 16px;
          }
          .text-dark {
            color: rgba(0,0,0);
            font-size: 14px;
          }
          /* CSS สำหรับการพิมพ์ (print) */
         @media print {
          body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 33.33%; /* เทียบเท่ากับ w-4/12 */
            height: 100%;
            background: rgba(239, 242, 240); /* หรือใช้สี bg-default ที่คุณต้องการ */
            z-index: -1; /* วางไว้ด้านหลังเนื้อหา */
            -webkit-print-color-adjust: exact; /* บังคับให้พิมพ์สีที่กำหนด */
          }
        }
        </style>
      </head>
      <body class="font-sans text-sm">
        <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
          <div class="sidebar flex flex-col items-start justify-start w-4/12 h-full border-2bg-default">
            <div class="flex items-center justify-center w-full p-2 gap-2">
              <img src="${process.env.NEXT_PUBLIC_API_URL}/images/user_picture/${employmentPicture}" class="w-28 mx-auto" />
            </div>
            <div class="flex items-center justify-start w-full p-2 gap-2">
              <span class="text-green">${hrIcon}</span> ${formattedBirthday}
            </div>
            <div class="flex items-center justify-start w-full p-2 border-2border-b-2">
              <span class="text-green">${emailIcon}</span> ${employeeEmail}
            </div>
            <div class="flex flex-col items-center justify-center w-full p-2 border-2border-b-2">
              <div class="flex items-center justify-center w-full h-full p-2 border-2text-dark-header">
                EDUCATIONS
              </div>
              <div class="flex flex-col items-start justify-start w-full h-full p-2 gap-2">
                ${educationHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full p-2 border-2border-b-2">
              <div class="flex items-center justify-center w-full h-full p-2 border-2text-dark-header">
                LICENSE NO.
              </div>
              <div class="flex flex-col items-start justify-start w-full h-full p-2 gap-2">
                ${licenseHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full p-2 border-2border-b-2">
              <div class="flex items-center justify-center w-full h-full p-2 border-2text-dark-header">
                LANGUAGE SKILLS
              </div>
              <div class="flex flex-col items-start justify-start w-full h-full p-2 gap-2">
                ${languageSkillHtml}
              </div>
            </div>
          </div>
          <div class="content flex flex-col items-start justify-start w-8/12 h-full gap-2">
            <div class="flex items-center justify-center w-full p-2 border-2text-blue mb-2">
              ${fullname}
            </div>
            <div class="flex items-center justify-center w-full p-2 border-2bg-header text-white">
              ${positionNameEN}
            </div>
            <div class="flex items-center justify-start w-full p-2 border-2text-green">
              WORK EXPERIENCE
            </div>
            <div class="flex flex-col items-center justify-center w-full p-2 gap-2">
              ${workHistoryHtml}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "company_logo",
      "company_logo.png"
    );
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString("base64");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: "80px",
        bottom: "50px",
        left: "30px",
        right: "0px",
      },
      headerTemplate: `
        <div style="position: fixed; top: 10px; left: 32px; right: 0; width: 100%; display: flex; -webkit-print-color-adjust: exact;">
            <img src="data:image/png;base64,${logoBase64}" style="width: 60px;" alt="Logo" />
        </div>
      `,
      footerTemplate: `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; font-size: 10px; font-family: 'THSarabunNew', sans-serif; -webkit-print-color-adjust: exact;">
          <div style="background-color: rgb(3, 153, 76); color: white; padding: 11.5px; text-align: center;">
            50/1 Moo 20 Soi Ngamwongwan 57 Ngamwongwan Rd., Ladyao Chatuchak, bangkok 10900 Tel 02-105-0999 TAX ID : 0105519001145
          </div>
        </div>
      `,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cvth_export_${cvENId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
