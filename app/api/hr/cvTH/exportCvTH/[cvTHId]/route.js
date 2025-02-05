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

    const params = await context.params;
    const cvTHId = parseInt(params.cvTHId, 10);

    if (!cvTHId) {
      return NextResponse.json(
        { error: "CVTH ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cvth = await prisma.cvTH.findUnique({
      where: { cvTHId: cvTHId },
      include: {
        CvTHEmployeeBy: {
          include: {
            employeeEmployment: {
              where: {
                employmentWorkStatus: "CurrentEmployee",
              },
              include: {
                EmploymentPositionId: {
                  select: { positionNameTH: true },
                },
              },
            },
          },
        },
        CvTHEducation: true,
        CvTHLicense: true,
        CvTHWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvTHLanguageSkill: true,
        CvTHCreateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
        CvTHUpdateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
      },
    });

    if (!cvth) {
      return NextResponse.json(
        { error: "No CvTH data found" },
        { status: 404 }
      );
    }

    const employmentPicture =
      cvth.CvTHEmployeeBy?.employeeEmployment?.[0]?.employmentPicture ||
      "default.png";

    const fullname = cvth.CvTHEmployeeBy
      ? `${cvth.CvTHEmployeeBy.employeeFirstnameTH} ${cvth.CvTHEmployeeBy.employeeLastnameTH}`
      : "-";

    const positionNameTH =
      cvth.CvTHEmployeeBy?.employeeEmployment?.[0]?.EmploymentPositionId
        ?.positionNameTH || "-";

    const employeeEmail = cvth.CvTHEmployeeBy?.employeeEmail || "-";

    const formattedBirthday = cvth.CvTHEmployeeBy?.employeeBirthday
      ? new Date(cvth.CvTHEmployeeBy.employeeBirthday).toLocaleDateString(
          "th-TH",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )
      : "-";

    const allWorkHistory = cvth.CvTHWorkHistory || [];
    const firstWorkHistory = allWorkHistory[0] || null;
    const otherWorkHistory = allWorkHistory.slice(1);

    let firstHistoryProjects = [];
    let remainingProjects = [];
    if (firstWorkHistory?.projects?.length > 0) {
      firstHistoryProjects = firstWorkHistory.projects.slice(0, 15);
      remainingProjects = firstWorkHistory.projects.slice(15);
    }

    const generateWorkExperienceItem = (wh, projectsArray) => {
      const projectsHtml =
        projectsArray && projectsArray.length > 0
          ? `
            <ul class="flex flex-col items-center justify-center w-full h-full gap-2 border-2">
              ${projectsArray
                .map(
                  (proj) => `
                    <div class="flex flex-row items-center justify-center w-full h-full gap-2 border-2">
                      <span class="flex items-center justify-center h-full p-2 gap-2 border-2">●</span>
                      <span class="flex items-center justify-start w-full h-full p-2 gap-2 border-2">
                        ${proj.cvTHProjectName} , ${proj.cvTHProjectDescription}
                      </span>
                    </div>
                  `
                )
                .join("")}
            </ul>
          `
          : '<div class="text-gray-500">No projects listed</div>';

      return `
          <div class="flex flex-row items-start justify-start w-full h-full p-2 gap-2 border-2">
            <div class="flex flex-col items-center justify-center w-4/12 h-full gap-2 border-2">
              <div class="flex flex-col items-start justify-start w-full h-full p-2 gap-2 border-2">
                <b>${wh.cvTHWorkHistoryCompanyName || ""}</b>
                <b>${wh.cvTHWorkHistoryPosition || ""}</b>
                <b>${wh.cvTHWorkHistoryStartDate || ""} - ${
        wh.cvTHWorkHistoryEndDate || ""
      }</b>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-8/12 h-full p-2 gap-2 border-2 border-l-2">
              ${projectsHtml}
            </div>
          </div>
    `;
    };

    let educationHtml = "";
    if (cvth.CvTHEducation && cvth.CvTHEducation.length > 0) {
      educationHtml = cvth.CvTHEducation.map((edu) => {
        return `
        <div class="flex flex-col items-center w-full p-2">
          <span>${edu.cvTHEducationDegree || "-"} ${
          edu.cvTHEducationStartDate || "-"
        }</span>
          <span>${edu.cvTHEducationInstitution || "-"}</span>
        </div>
      `;
      }).join("");
    } else {
      educationHtml = '<div class="text-gray-500">No Educations found</div>';
    }

    let licenseHtml = "";
    if (cvth.CvTHLicense && cvth.CvTHLicense.length > 0) {
      licenseHtml = cvth.CvTHLicense.map((lic) => {
        return `
        <div class="flex flex-row items justify-between w-full p-2">
          <span> ${lic.cvTHProfessionalLicenseName || "-"} , </span>
          <span> ${lic.cvTHProfessionalLicenseNumber || "-"}</span>          
        </div>
      `;
      }).join("");
    } else {
      licenseHtml = '<div class="text-gray-500">No License data</div>';
    }

    let languageSkillHtml = "";
    if (cvth.CvTHLanguageSkill && cvth.CvTHLanguageSkill.length > 0) {
      languageSkillHtml = cvth.CvTHLanguageSkill.map((lang) => {
        return `
        <div class="flex flex-row items-center justify-between w-full p-2">
          <span> ${lang.cvTHLanguageSkillName || "-"} : </span>
         <span> ${lang.cvTHLanguageSkillProficiency || "-"}</span>
        </div>
      `;
      }).join("");
    } else {
      languageSkillHtml =
        '<div class="text-gray-500">No language skills data</div>';
    }

    const firstWorkHistoryHtml = firstWorkHistory
      ? generateWorkExperienceItem(firstWorkHistory, firstHistoryProjects)
      : '<div class="text-gray-500">No work experience data available</div>';

    const remainingProjectsHtml =
      remainingProjects.length > 0
        ? generateWorkExperienceItem(firstWorkHistory, remainingProjects)
        : "";

    const otherWorkHistoryHtml =
      otherWorkHistory.length > 0
        ? otherWorkHistory
            .map((wh) => generateWorkExperienceItem(wh, wh.projects))
            .join("")
        : "";

    const secondPageContentNeeded =
      remainingProjects.length > 0 || otherWorkHistory.length > 0;

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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M10.5 22v-2m4 2v-2"/><path fill="currentColor" d="M11 20v.75h.75V20zm3-.75a.75.75 0 0 0 0 1.5zm3.5-14a.75.75 0 0 0 0 1.5zM7 5.25a.75.75 0 0 0 0 1.5zm2 14a.75.75 0 0 0 0 1.5zm6 1.5a.75.75 0 0 0 0-1.5zm-4.75-9.5V20h1.5v-8.75zm.75 8H4.233v1.5H11zm-8.25-1.855V11.25h-1.5v6.145zm1.483 1.855c-.715 0-1.483-.718-1.483-1.855h-1.5c0 1.74 1.231 3.355 2.983 3.355zM6.5 6.75c1.967 0 3.75 1.902 3.75 4.5h1.5c0-3.201-2.246-6-5.25-6zm0-1.5c-3.004 0-5.25 2.799-5.25 6h1.5c0-2.598 1.783-4.5 3.75-4.5zm14.75 6v6.175h1.5V11.25zm-1.457 8H14v1.5h5.793zm1.457-1.825c0 1.12-.757 1.825-1.457 1.825v1.5c1.738 0 2.957-1.601 2.957-3.325zm1.5-6.175c0-3.201-2.246-6-5.25-6v1.5c1.967 0 3.75 1.902 3.75 4.5zM7 6.75h11v-1.5H7zm2 14h6v-1.5H9z"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M5 16h3m8-6.116V5.411m0 0V2.635c0-.236.168-.439.4-.484l.486-.093a3.2 3.2 0 0 1 1.755.156l.08.03c.554.214 1.16.254 1.737.115a.44.44 0 0 1 .542.427v2.221a.51.51 0 0 1-.393.499l-.066.016a3.2 3.2 0 0 1-1.9-.125a3.2 3.2 0 0 0-1.755-.156z"/></g></svg>
    `;

    const htmlPage1 = `
        <div class="flex flex-row items-start justify-center w-full h-full gap-2 border-2">
          <div class="flex flex-col items-center justify-start w-8/12 h-full p-2 gap-2 border-2">
            <div class="flex flex-row items-center justify-center w-full gap-2 border-2">
              <div class="flex items-center justify-center h-full py-2 gap-2 border-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/company_logo/company_logo.png" class="w-20 mx-auto" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 text-blue">
                ${fullname}
              </div>
            </div>
            <div class="flex items-center justify-center w-full p-2 gap-2 border-2 bg-header text-white rounded-lg">
              ${positionNameTH}
            </div>
            <div class="flex items-center justify-start w-full p-2 gap-2 border-2 text-dark-header">
              Work Experience
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-2 border-2">
             ${firstWorkHistoryHtml}
            </div>
          </div>
          <div class="flex flex-col items-center justify-start w-4/12 h-full p-2 gap-2 border-2 rounded-3xl bg-right">
            <div class="flex items-center justify-center w-full p-2 gap-2 border-2">
               <img src="${process.env.NEXT_PUBLIC_API_URL}/images/user_picture/${employmentPicture}" class="w-28 mx-auto" />
            </div>
            <div class="flex items-center justify-start w-full p-2 gap-2 border-2">
              <span class="text-green">${hrIcon}</span> ${formattedBirthday}
            </div>
            <div class="flex items-center justify-start w-full p-2 gap-2 border-2 border-b-2">
              <span class="text-green">${emailIcon}</span> ${employeeEmail}
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-2 border-2 border-b-2">
              <div class="flex items-center justify-center w-full p-2 gap-2 border-2 text-dark-header">
                Educations
              </div>
              <div class="flex flex-col items-center justify-center w-full p-2 gap-2 border-2">
                ${educationHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-2 border-2 border-b-2">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 text-dark-header">
                License No
              </div>
              <div class="flex flex-col items-center justify-center w-full p-2 gap-2 border-2">
                ${licenseHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-2 border-2 border-b-2">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 text-dark-header">
                Language Skills
              </div>
              <div class="flex flex-col items-center justify-center w-full p-2 gap-2 border-2">
                ${languageSkillHtml}
              </div>
            </div>
          </div>
        </div>
    `;

    const htmlPage2 = secondPageContentNeeded
      ? `
      <div class="page-break"></div>
      <div class="flex flex-col items-start justify-start w-full p-2 gap-2 border-2">
        <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 text-dark-header">
          Work Experience
        </div>        
        ${remainingProjectsHtml}
        ${otherWorkHistoryHtml}
      </div>
    `
      : "";

    const fullHtmlContent = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
        <style>
          .bg-header {
            background: rgba(3, 153, 76);
          }
          .bg-right {
            background: rgba(239, 242, 240);
          }
          .text-blue {
            color: rgba(64,89,146);
            font-size: 30px;
          }
          .text-green {
            color: rgba(3, 153, 76);
            font-size: 30px;
          }
          .text-white {
            color: rgba(255,255,255);
            font-size: 18px;
          }
          .text-dark-header {
            color: rgba(0,0,0);
            font-size: 16px;
            font-weight: 900;
          }
          .text-dark {
            color: rgba(0,0,0);
            font-size: 14px;
          }
          @media print {
            .pdf-container {
              padding: 40px;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body class="font-sans text-sm" style="font-family: 'Sarabun', sans-serif;">
        ${htmlPage1}
        ${htmlPage2}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(fullHtmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "80px",
        right: "20px",
      },
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; font-size: 10px; -webkit-print-color-adjust: exact;">
          <div style="background-color: rgb(3, 153, 76); color: white; padding: 10px; text-align: center;">
            50/1 หมู่ 20 ซอยงามวงศ์วาน 57 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900 โทร 02-105-0999 (30 คู่สาย) แฟกซ์ 02-580-1852
          </div>
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
