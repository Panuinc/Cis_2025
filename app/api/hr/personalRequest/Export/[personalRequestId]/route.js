import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import prisma from "@/lib/prisma";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { getRequestIP } from "@/lib/GetRequestIp";
import fs from "fs";
import path from "path";

// ดึง CSS จาก globals.css
const globalCSS = fs.readFileSync(
  path.join(process.cwd(), "public/css/globals.css"),
  "utf-8"
);

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const personalRequestId = parseInt(params.personalRequestId, 10);

    if (!personalRequestId) {
      return NextResponse.json(
        { error: "PersonalRequest ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const personalRequest = await prisma.personalRequest.findUnique({
      where: { personalRequestId },
      include: {
        PersonalRequestBranchId: { select: { branchName: true } },
        PersonalRequestDivisionId: { select: { divisionName: true } },
        PersonalRequestDepartmentId: { select: { departmentName: true } },
        PersonalRequestPositionId: { select: { positionName: true } },
        PersonalRequestCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        PersonalRequestUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!personalRequest) {
      return NextResponse.json(
        { error: "No personalRequest data found" },
        { status: 404 }
      );
    }

    const htmlContent = `
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="font-sans p-4">
      <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <img src="${
                    process.env.NEXT_PUBLIC_API_URL
                  }/images/company_logo/company_logo.png" />
              </div>
              <div
                  class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed text-3xl font-[900]">
                  ใบขออัตรากำลังคน : Personnel Request
              </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ด้วยข้าพเจ้า นาย / นาง / นางสาว
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${
                        personalRequest.PersonalRequestCreateBy
                          ? personalRequest.PersonalRequestCreateBy
                              .employeeFirstname +
                            " " +
                            personalRequest.PersonalRequestCreateBy.employeeLastname
                          : "-"
                      }
                  </div>
              </div>
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ตำแหน่ง
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${personalRequest.employeeFirstname || "-"}
                  </div>
              </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      แผนก
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${
                        personalRequest.PersonalRequestCreateBy
                          ? personalRequest.PersonalRequestCreateBy
                              .employeeFirstname +
                            " " +
                            personalRequest.PersonalRequestCreateBy.employeeLastname
                          : "-"
                      }
                  </div>
              </div>
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      มีความประสงค์ขออัตรากำลังคนจำนวน
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${personalRequest.employeeFirstname || "-"}
                  </div>
              </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ในตำแหน่ง
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${
                        personalRequest.PersonalRequestCreateBy
                          ? personalRequest.PersonalRequestCreateBy
                              .employeeFirstname +
                            " " +
                            personalRequest.PersonalRequestCreateBy.employeeLastname
                          : "-"
                      }
                  </div>
              </div>
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ประจำสาขา
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${personalRequest.employeeFirstname || "-"}
                  </div>
              </div>
              <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      วันที่
                  </div>
                  <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                      ${personalRequest.employeeFirstname || "-"}
                  </div>
              </div>
          </div>
      </div>
    </body>
    </html>
  `;

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="personal_request_${personalRequestId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
