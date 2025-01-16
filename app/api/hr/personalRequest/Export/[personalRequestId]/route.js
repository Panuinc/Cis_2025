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
    const personalRequestId = parseInt(params.personalRequestId, 10);

    if (!personalRequestId) {
      return NextResponse.json(
        { error: "PersonalRequest ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const personalRequest = await prisma.personalRequest.findMany({
      where: { personalRequestId: personalRequestId },
      include: {
        PersonalRequestBranchId: {
          select: { branchName: true },
        },
        PersonalRequestDivisionId: {
          select: { divisionName: true },
        },
        PersonalRequestDepartmentId: {
          select: { departmentName: true },
        },
        PersonalRequestPositionId: {
          select: { positionName: true },
        },
        PersonalRequestCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        PersonalRequestUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!personalRequest?.length) {
      return NextResponse.json(
        { error: "No personalRequest data found" },
        { status: 404 }
      );
    }
    // สร้าง HTML สำหรับ PDF โดยใช้ข้อมูลที่ดึงมา
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .header img { width: 50px; height: 50px; }
          .header h1 { font-size: 16px; font-weight: bold; }
          .section { margin-bottom: 10px; }
          .textRow { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { width: 30%; font-weight: bold; }
          .value { width: 70%; border-bottom: 1px solid black; padding-bottom: 2px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${
            process.env.NEXT_PUBLIC_API_URL
          }/images/company_logo/company_logo.png"  />
          
          <h1>ใบขออัตรากำลังคน : Personnel Request</h1>
        </div>
        <div class="section">
          <div class="textRow">
            <div class="label">รหัสเอกสาร ID:</div>
            <div class="value">${
              personalRequest.personalRequestDocumentId || "-"
            }</div>
          </div>
          <div class="textRow">
            <div class="label">สถานะ:</div>
            <div class="value">${
              personalRequest.personalRequestStatus || "-"
            }</div>
          </div>
          <div class="textRow">
            <div class="label">สร้างโดย:</div>
            <div class="value">
              ${
                personalRequest.PersonalRequestCreateBy
                  ? personalRequest.PersonalRequestCreateBy.employeeFirstname +
                    " " +
                    personalRequest.PersonalRequestCreateBy.employeeLastname
                  : "-"
              }
            </div>
          </div>
          <div class="textRow">
            <div class="label">สร้างเมื่อ:</div>
            <div class="value">${
              new Date(
                personalRequest.personalRequestCreateAt
              ).toLocaleString() || "-"
            }</div>
          </div>
          <!-- เพิ่มข้อมูลเพิ่มเติมตามต้องการ -->
        </div>
      </body>
      </html>
    `;

    // ใช้ Puppeteer ในการสร้าง PDF จาก HTML
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
