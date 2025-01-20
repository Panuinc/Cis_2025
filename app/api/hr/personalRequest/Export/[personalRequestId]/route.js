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
        { day: "numeric", month: "numeric", year: "numeric" }
      )
    : "-";

    const formattedDesiredDate = personalRequest.personalRequestDesiredDate
    ? new Date(personalRequest.personalRequestDesiredDate).toLocaleDateString(
        "th-TH",
        { day: "numeric", month: "numeric", year: "numeric" }
      )
    : "-";

    const genderValue = personalRequest.personalRequestReasonGender || "";

    const employmentTypeValue = personalRequest.personalRequestEmploymentType || "";

    const reasonForRequestValue = personalRequest.personalRequestReasonForRequest || "";

    const htmlContent = `
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        input[type="checkbox"] {
          -webkit-appearance: checkbox;
          -moz-appearance: checkbox;
          appearance: checkbox;
        }
      </style>
    </head>   
     <body class="font-sans p-8 text-sm">
      <div class="flex flex-col items-center justify-start w-full h-full gap-2">
        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex items-center justify-center h-full gap-2">
            <img src="${process.env.NEXT_PUBLIC_API_URL}/images/company_logo/company_logo.png" class="w-28 min-h-28" />
          </div>
          <div class="flex items-center justify-center w-full h-full gap-2 text-3xl font-[900]">
            ใบขออัตรากำลังคน : Personnel Request
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2 mt-10">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              ด้วยข้าพเจ้า นาย / นาง / นางสาว
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy ? personalRequest.PersonalRequestCreateBy.employeeFirstname +" " +personalRequest.PersonalRequestCreateBy.employeeLastname: "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              ตำแหน่ง
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0 &&personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentPositionId? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentPositionId.positionName: "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              แผนก
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0 &&personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentDepartmentId? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].EmploymentDepartmentId.departmentName: "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              มีความประสงค์ขออัตรากำลังคนจำนวน
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestAmount || "-"}
            </div>
            <div class="flex items-center justify-start w-full h-full gap-2">
              อัตตรา
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              ในตำแหน่ง
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.PersonalRequestPositionId.positionName || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              ประจำสาขา
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.PersonalRequestBranchId.branchName || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              วันที่ต้องการ
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${formattedDesiredDate}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-start justify-start w-full h-full gap-2">
              ประเภทพนักงาน
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full gap-2">
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${employmentTypeValue === "FULL_TIME" ? "checked" : ""}
                />
                <span>FULL_TIME</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${employmentTypeValue === "PART_TIME" ? "checked" : ""}
                  />
                <span>PART_TIME</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${employmentTypeValue === "TEMPORARY" ? "checked" : ""}
                  />
                <span>TEMPORARY</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${employmentTypeValue === "CONTRACT" ? "checked" : ""}
                  />
                <span>CONTRACT</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${employmentTypeValue === "INTERN" ? "checked" : ""}
                  />
                <span>INTERN</span>
              </label>
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-start justify-start w-full h-full gap-2">
              เหตุผลในการขอรับ
            </div>
            <div class="flex flex-col items-center justify-center w-full h-full gap-2">
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${reasonForRequestValue === "REPLACE_STAFF" ? "checked" : ""}
                />
                <span>REPLACE_STAFF</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${reasonForRequestValue === "NEW_POSITION" ? "checked" : ""}
                  />
                <span>NEW_POSITION</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${reasonForRequestValue === "EXPANSION" ? "checked" : ""}
                  />
                <span>EXPANSION</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${reasonForRequestValue === "OTHER" ? "checked" : ""}
                  />
                <span>OTHER</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              คุณสมบัติ
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              1.เพศ
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${genderValue === "ชาย" ? "checked" : ""}
                />
                <span>ชาย</span>
              </label>
              <label class="flex items-center justify-start w-full h-full gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${genderValue === "หญิง" ? "checked" : ""}
                  />
                <span>หญิง</span>
              </label>
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              2.อายุ
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonAge || "-"}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              3.วุฒิการศึกษา
            </div>
            <div class="flex items-center justify-center w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonEducation || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              4.ความสามารถทางภาษาอังกฤษ
            </div>
            <div class="flex items-center justify-start w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonEnglishSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              5.ความสามารถทางด้านคอมพิวเตอร์
            </div>
            <div class="flex items-center justify-start w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonComputerSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              6.ความสามารถพิเศษอื่นๆ
            </div>
            <div class="flex items-center justify-start w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonOtherSkill || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              7.ความรู้ ความชำนาญ หรือประสบการณ์ที่ต้องการ
            </div>
            <div class="flex items-center justify-start w-full h-full gap-2 border-b-2">
              ${personalRequest.personalRequestReasonExperience || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-row items-center justify-center w-full h-full gap-2">
            <div class="flex items-center justify-start w-full h-full gap-2">
              8.ลักษณะงาน และหน้าที่ความรับผิดชอบ ( แนบใบกำหนดลักษณะงาน Job Description FM-HR3-01 )
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2 mt-20">
          <div class="flex flex-col items-center justify-center w-full h-full gap-2">
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                ผู้ขอเสนอ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                (ผู้จัดการแผนก/ฝ่าย/หัวหน้างาน)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                วันที่  ${formattedCreateAt}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full gap-2">
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                (ผู้ช่วยผู้จัดการ/ผู้จัดการ)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                วันที่  ${formattedCreateAt}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full gap-2">
          <div class="flex flex-col items-center justify-center w-full h-full gap-2">
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                (แผนกบุคคล)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                วันที่  ${formattedCreateAt}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full gap-2">
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${personalRequest.PersonalRequestCreateBy &&personalRequest.PersonalRequestCreateBy.employeeEmployment &&personalRequest.PersonalRequestCreateBy.employeeEmployment.length > 0? personalRequest.PersonalRequestCreateBy.employeeEmployment[0].employmentSignature: " default_signature.png"}" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full gap-2">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                (รองกรรมการผู้จัดการ)
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full gap-2">
              <div class="flex items-center justify-center w-full h-full gap-2">
                วันที่  ${formattedCreateAt}
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