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

    const personalRequest = await prisma.personalRequest.findUnique({
      where: { personalRequestId },
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
          select: {
            employeeFirstname: true,
            employeeLastname: true,
            employeeEmployment: {
              select: {
                EmploymentPositionId: { select: { positionName: true } },
                EmploymentDepartmentId: { select: { departmentName: true } },
                employmentSignature: true,
              },
              take: 1,
            },
          },
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

    const formattedCreateAt = personalRequest.personalRequestCreateAt
      ? new Date(personalRequest.personalRequestCreateAt).toLocaleDateString(
          "th-TH",
          {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }
        )
      : "-";

    const formattedDesiredDate = personalRequest.personalRequestDesiredDate
      ? new Date(personalRequest.personalRequestDesiredDate).toLocaleDateString(
          "th-TH",
          {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }
        )
      : "-";

    const htmlContent = `
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="font-sans p-4">
      <div class="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex items-center justify-center h-full p-2 gap-2 border-2 border-dashed">
            <img src="${process.env.NEXT_PUBLIC_API_URL}/images/company_logo/company_logo.png" class="w-28 min-h-28" />
          </div>
          <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed text-3xl font-[900]">
            ใบขออัตรากำลังคน : Personnel Request
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              ด้วยข้าพเจ้า นาย / นาง / นางสาว
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy ? personalRequest.PersonalRequestCreateBy.employeeFirstname +" " +personalRequest.PersonalRequestCreateBy.employeeLastname: "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              ตำแหน่ง
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0 &&personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentPositionId? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentPositionId.positionName: "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              แผนก
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0 &&personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentDepartmentId? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentDepartmentId.departmentName: "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              มีความประสงค์ขออัตรากำลังคนจำนวน
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestAmount || "-"}
            </div>
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              อัตตรา
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              ในตำแหน่ง
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.PersonalRequestPositionId.positionName || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              ประจำสาขา
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.PersonalRequestBranchId.branchName || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              วันที่ต้องการ
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${formattedDesiredDate}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              ประเภทพนักงาน
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestEmploymentType || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              เหตุผลในการขอรับ
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonForRequest || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              คุณสมบัติ
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              1.เพศ
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonGender || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              2.อายุ
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonAge || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              3.วุฒิการศึกษา
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonEducation || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              4.ความสามารถทางภาษาอังกฤษ
            </div>
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonEnglishSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              5.ความสามารถทางด้านคอมพิวเตอร์
            </div>
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonComputerSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              6.ความสามารถพิเศษอื่นๆ
            </div>
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonOtherSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              7.ความรู้ ความชำนาญ หรือประสบการณ์ที่ต้องการ
            </div>
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
              ${personalRequest.personalRequestReasonExperience || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dashed">
              8.ลักษณะงาน และหน้าที่ความรับผิดชอบ ( แนบใบกำหนดลักษณะงาน Job Description FM-HR3-01 )
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ผู้ขอเสนอ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                (ผู้จัดการแผนก/ฝ่าย/หัวหน้างาน)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dashed">
                วันที่
              </div>
              <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
                ${formattedCreateAt}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                (ผู้ช่วยผู้จัดการ/ผู้จัดการ)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dashed">
                วันที่
              </div>
              <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
                ${formattedCreateAt}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-danger border-dashed">
          <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                (แผนกบุคคล)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dashed">
                วันที่
              </div>
              <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
                ${formattedCreateAt}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
                (รองกรรมการผู้จัดการ)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed">
              <div class="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dashed">
                วันที่
              </div>
              <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-b-2">
                ${formattedCreateAt}
              </div>
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

const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `
    <div style="width: 100%; text-align: right; font-size: 10px; padding-right: 10px;">
      FM01-WP-HR1-01 / Rev.00 / 24-02-64
    </div>
  `,
});

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