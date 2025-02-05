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
                  select: { positionName: true },
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

    const fullname = cvth.CvTHEmployeeBy
      ? `${cvth.CvTHEmployeeBy.employeeFirstname} ${cvth.CvTHEmployeeBy.employeeLastname}`
      : "-";

    const positionName =
      cvth.CvTHEmployeeBy?.employeeEmployment?.[0]?.EmploymentPositionId
        ?.positionName || "-";

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

    let workHistoryHtml = "";
    if (cvth.CvTHWorkHistory && cvth.CvTHWorkHistory.length > 0) {
      workHistoryHtml = cvth.CvTHWorkHistory.map((wh) => {
        const projectsHtml =
          wh.projects && wh.projects.length > 0
            ? `
                <ul class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  ${wh.projects
                    .map(
                      (proj) => `
                    <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      <span class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">●</span>
                      <span class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">${proj.cvTHProjectName}</span>
                    </div>
                  `
                    )
                    .join("")}
                </ul>
              `
            : '<div class="text-gray-500">No projects listed</div>';

        return `
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  ${wh.cvTHWorkHistoryCompanyName || ""}
                </div>
                <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  ${wh.cvTHWorkHistoryPosition || ""}
                </div>
                <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  ${wh.cvTHWorkHistoryStartDate || ""} - ${
          wh.cvTHWorkHistoryEndDate || "PRESENT"
        }
                </div>
              </div>
              <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
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
    if (cvth.CvTHEducation && cvth.CvTHEducation.length > 0) {
      educationHtml = cvth.CvTHEducation.map((edu) => {
        return `
        <div class="flex flex-col items-start w-full p-1 border-b">
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
        <div class="flex flex-col items-start w-full p-1 border-b">
          <span> ${lic.cvTHProfessionalLicenseName || "-"}</span>
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
        <div class="flex flex-col items-start w-full p-1 border-b">
          <span> ${lang.cvTHLanguageSkillName || "-"} : ${
          lang.cvTHLanguageSkillProficiency || "-"
        }</span>
        
        </div>
      `;
      }).join("");
    } else {
      languageSkillHtml =
        '<div class="text-gray-500">No language skills data</div>';
    }

    const htmlContent = `
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
          @media print {
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body class="font-sans text-sm" style="font-family: 'Sarabun', sans-serif;">
        <div class="flex flex-row items-start justify-center w-full h-full p-10 gap-2 border-2 border-dashed page-break">
          <div class="flex flex-col items-center justify-center w-8/12 h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/company_logo/company_logo.png" class="w-28 mx-auto" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ${fullname}
              </div>
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed bg-header">
              ${positionName}
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              Work Experience
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed work-experience">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed" id="first-page-work-history"></div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-4/12 h-full p-2 gap-2 border-2 border-dashed rounded-3xl bg-right">
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <img src="${process.env.NEXT_PUBLIC_API_URL}/images/company_logo/company_logo.png" class="w-28 mx-auto" />
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              ${formattedBirthday}
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              ${employeeEmail}
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                Educations
              </div>
              <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ${educationHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                License No
              </div>
              <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ${licenseHtml}
              </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                Language Skills
              </div>
              <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ${languageSkillHtml}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-start justify-center w-full h-full p-10 gap-2 border-2 border-dashed page-break second-page">
          <div class="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
            <div id="second-page-work-history" class="flex flex-col items-center justify-center w-full"></div>
          </div>
        </div>
        <script>
          function distributeWorkHistory() {
            const firstPageWorkHistory = document.getElementById('first-page-work-history');
            const secondPageWorkHistory = document.getElementById('second-page-work-history');
            const fullWorkHistory = \`${workHistoryHtml}\`;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fullWorkHistory;
            const workHistoryItems = Array.from(tempDiv.children);

            let firstPageHeight = 0;
            const firstPageContainer = document.querySelector('.work-experience');
            const maxFirstPageHeight = firstPageContainer.clientHeight;

            for (let item of workHistoryItems) {
              if (firstPageHeight + item.clientHeight <= maxFirstPageHeight) {
                firstPageWorkHistory.appendChild(item);
                firstPageHeight += item.clientHeight;
              } else {
                secondPageWorkHistory.appendChild(item);
              }
            }
          }
          window.onload = distributeWorkHistory;
        </script>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
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
