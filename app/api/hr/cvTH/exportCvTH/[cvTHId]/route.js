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

    const htmlContent = `
      <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
        <style>
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
            .bg-header{
              background: rgba(3, 153, 76);            
            }
        </style>
      </head>
      <body class="font-sans p-8 text-sm" style="font-family: 'Sarabun', sans-serif;">
        <div class="flex flex-row items-start justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
        <div class="flex flex-col items-center justify-center w-8/12 h-full p-2 gap-2 border-2 border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <img src="${
                process.env.NEXT_PUBLIC_API_URL
              }/images/company_logo/company_logo.png" class="w-28 mx-auto" />
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
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
          ${
            cvth.CvTHWorkHistory && cvth.CvTHWorkHistory.length > 0
              ? cvth.CvTHWorkHistory.map(
                  (wh, index) => `

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
            <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-l-2">
                ${
                  wh.projects && wh.projects.length > 0
                    ? `<ul class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
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
                          </ul>`
                    : '<div class="text-gray-500">No projects listed</div>'
                }
            </div>
          </div>
          `
                ).join("")
              : '<div class="text-gray-500">No work experience data available</div>'
          }
        </div>
        
        <div class="flex flex-col items-center justify-center w-4/12 h-full p-2 gap-2 border-2 border-dashed">
          01
        </div>

        </div>
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
