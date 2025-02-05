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
    const trainingId = parseInt(params.trainingId, 10);

    if (!trainingId) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const training = await prisma.training.findUnique({
      where: { trainingId },
      include: {
        employeeTrainingTraining: {
          include: {
            TrainingEmployeeEmployeeId: {
              select: {
                employeeFirstnameTH: true,
                employeeLastnameTH: true,
                employeeEmployment: {
                  select: {
                    EmploymentPositionId: { select: { positionNameTH: true } },
                    EmploymentDivisionId: { select: { divisionName: true } },
                  },
                },
              },
            },
          },
        },
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: { employeeFirstnameTH: true, employeeLastnameTH: true },
            },
          },
        },
        TrainingCreateBy: {
          select: {
            employeeFirstnameTH: true,
            employeeLastnameTH: true,
            employeeEmployment: {
              select: {
                employmentSignature: true,
              },
              take: 1,
            },
          },
        },
        TrainingUpdateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
        TrainingHrApproveBy: {
          select: {
            employeeFirstnameTH: true,
            employeeLastnameTH: true,
            employeeEmployment: {
              select: {
                employmentSignature: true,
              },
              take: 1,
            },
          },
        },
        TrainingMdApproveBy: {
          select: {
            employeeFirstnameTH: true,
            employeeLastnameTH: true,
            employeeEmployment: {
              select: {
                employmentSignature: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!training) {
      return NextResponse.json(
        { error: "No training data found" },
        { status: 404 }
      );
    }

    const formattedCreateAt = training.trainingCreateAt
      ? new Date(training.trainingCreateAt).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })
      : "-";

    const startDate = new Date(training.trainingStartDate);
    const startYear = startDate.getUTCFullYear();
    const startMonth = String(startDate.getUTCMonth() + 1).padStart(2, "0");
    const startDay = String(startDate.getUTCDate()).padStart(2, "0");
    const startHours = String(startDate.getUTCHours()).padStart(2, "0");
    const startMinutes = String(startDate.getUTCMinutes()).padStart(2, "0");

    const formattedStartDate = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`;

    const endDate = new Date(training.trainingEndDate);
    const endYear = endDate.getUTCFullYear();
    const endMonth = String(endDate.getUTCMonth() + 1).padStart(2, "0");
    const endDay = String(endDate.getUTCDate()).padStart(2, "0");
    const endHours = String(endDate.getUTCHours()).padStart(2, "0");
    const endMinutes = String(endDate.getUTCMinutes()).padStart(2, "0");

    const formattedEndDate = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}`;

    const TrainingType = training.trainingType || "";
    const InstitutionsType = training.trainingInstitutionsType || "";
    const reasonForRequestValue = training.trainingReasonForRequest || "";

    // สร้างแถวของตารางสำหรับ employeeTrainingTraining
    const employeeTableRows =
      training.employeeTrainingTraining &&
      training.employeeTrainingTraining.length > 0
        ? training.employeeTrainingTraining
            .map(
              (item, index) => `
          <tr>
            <td class="border px-4 py-2 text-center">${index + 1}</td>
            <td class="border px-4 py-2">${
              item.TrainingEmployeeEmployeeId.employeeFirstnameTH
            } ${item.TrainingEmployeeEmployeeId.employeeLastnameTH}</td>
            <td class="border px-4 py-2">${
              item.TrainingEmployeeEmployeeId.employeeEmployment[0]
                ?.EmploymentPositionId?.positionNameTH || "-"
            }</td>
            <td class="border px-4 py-2">${
              item.TrainingEmployeeEmployeeId.employeeEmployment[0]
                ?.EmploymentDivisionId?.divisionName || "-"
            }</td>
          </tr>
        `
            )
            .join("")
        : `
          <tr>
            <td class="border px-4 py-2 text-center" colspan="4">ไม่มีข้อมูล</td>
          </tr>
        `;

    const htmlContent = `
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
      <style>
          input[type="checkbox"] {
            -webkit-appearance: checkbox;
            -moz-appearance: checkbox;
            appearance: checkbox;
          }
          /* CSS สำหรับลายน้ำ */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            font-weight: bold;
            color: rgba(255, 0, 0, 0.2); /* สีแดงจาง ๆ สำหรับ Cancel */
            z-index: 1000;
            pointer-events: none; /* ไม่ให้ลายน้ำขัดขวางการคลิก */
          }
        </style>
    </head>
    <body class="font-sans p-8 text-sm" style="font-family: 'Sarabun', sans-serif;">
      ${
        training.trainingStatus === "ApprovedSuccess"
          ? '<div class="watermark" style="color: rgba(0, 128, 0, 0.2);">Approved</div>'
          : ["ManagerCancel", "HrCancel", "MdCancel", "Cancel"].includes(
              training.trainingStatus
            )
          ? '<div class="watermark" style="color: rgba(255, 0, 0, 0.2);">Cancel</div>'
          : ""
      }

      <div class="flex flex-col items-center justify-start w-full h-full p-0.5 ">
        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex items-center justify-center h-full">
            <img src="${
              process.env.NEXT_PUBLIC_API_URL
            }/images/company_logo/company_logo.png" class="w-28 min-h-28" />
          </div>
          <div class="flex items-center justify-center w-full h-full p-0.5  text-3xl font-[900]">
            แบบขออนุมัติเพื่อเข้าอบรม - สัมนา
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              1. ชื่อหลักสูตร
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingName || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              2. ประเภทหลักสูตร
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <label class="flex items-center justify-start w-full h-full p-0.5 gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${
                    TrainingType === "Training_to_prepare_for_work"
                      ? "checked"
                      : ""
                  }
                />
                <span>prepare</span>
              </label>
              <label class="flex items-center justify-start w-full h-full p-0.5 gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${
                    TrainingType === "Training_to_upgrade_labor_skills"
                      ? "checked"
                      : ""
                  }
                />
                <span>upgrade skills</span>
              </label>
              <label class="flex items-center justify-start w-full h-full p-0.5 gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${
                    TrainingType === "Training_to_change_career_fields"
                      ? "checked"
                      : ""
                  }
                />
                <span>change_career</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              3. วัตถุประสงค์
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingObjectives || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              4. กลุ่มเป้านหมาย
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingTargetGroup || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              5. สถาบันที่จัดฝึกอบรม/วิทยากร
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <label class="flex items-center justify-start w-full h-full p-0.5 gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${InstitutionsType === "Internal" ? "checked" : ""}
                />
                <span>Internal</span>
              </label>
              <label class="flex items-center justify-start w-full h-full p-0.5 gap-2">
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  ${InstitutionsType === "External" ? "checked" : ""}
                />
                <span>External</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              5.1 สถาบันที่ฝึกอบรม
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingInstitutions || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              5.2 วิทยากร
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingLecturer || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              5.3 สถานที่ฝึกอบรม
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${training.trainingLocation || "-"}
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              6 กำหนดระยะเวลา
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              วัน/เดือน/ปี
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${formattedStartDate}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              ถึง
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
            <div class="flex items-center justify-start w-full h-full p-0.5 ">
              วัน/เดือน/ปี
            </div>
            <div class="flex items-center justify-start w-full h-full p-0.5  border-b-2 ">
              ${formattedEndDate}
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-full p-0.5">
          <table class="min-w-full p-0.5 border-collapse">
            <thead class="bg-gray-200">
              <tr>
                <th class="border px-4 py-2">ลำดับ</th>
                <th class="border px-4 py-2">รายชื่อ</th>
                <th class="border px-4 py-2">ตำแหน่ง</th>
                <th class="border px-4 py-2">ฝ่าย</th>
              </tr>
            </thead>
            <tbody>
              ${employeeTableRows}
            </tbody>
          </table>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex items-center justify-start w-full h-full p-0.5 ">
            7 ค่าใช้จ่ายในการฝึกอบรมณ์ - สัมนา
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-11/12">
          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                7.1 ค่าฝึกอบรม/เอกสาร/วิทยากร
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingPrice || "-"}
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  ">
                บาท
              </div>
            </div>

            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                7.2 ค่าห้องอบรมแลอุปกรณ์
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingEquipmentPrice || "-"}
              </div>
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                บาท
              </div>
            </div>

            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                7.3 ค่าอาหาร
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingFoodPrice || "-"}
              </div>
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                บาท
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                7.4 ค่ายานพาหนะ
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingFarePrice || "-"}
              </div>
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                บาท
              </div>
            </div>

            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                7.5 อื่นๆ
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingOtherExpenses || "-"}   ${
      training.trainingOtherPrice || "-"
    }
              </div>
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                บาท
              </div>
            </div>

            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                รวม
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                ${training.trainingSumPrice || "-"}
              </div>
              <div class="flex items-center justify-start w-full h-full p-0.5 ">
                บาท
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${
      training.TrainingCreateBy &&
      training.TrainingCreateBy.employeeEmployment &&
      training.TrainingCreateBy.employeeEmployment.length > 0
        ? training.TrainingCreateBy.employeeEmployment[0].employmentSignature
        : "default_signature.png"
    }" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ผู้ขออนุมัติ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ( ${
                  training.TrainingCreateBy
                    ? `${training.TrainingCreateBy.employeeFirstnameTH} ${training.TrainingCreateBy.employeeLastnameTH}`
                    : "-"
                })
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ผู้จัดทำ
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${
      training.TrainingHrApproveBy &&
      training.TrainingHrApproveBy.employeeEmployment &&
      training.TrainingHrApproveBy.employeeEmployment.length > 0
        ? training.TrainingHrApproveBy.employeeEmployment[0].employmentSignature
        : "default_signature.png"
    }" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ผู้ทบทวน
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
             (   ${
               training.TrainingHrApproveBy
                 ? `${training.TrainingHrApproveBy.employeeFirstnameTH} ${training.TrainingHrApproveBy.employeeLastnameTH}`
                 : "-"
             })
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ผู้จัดการฝ่ายทรัพยากรบุคคล
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-center w-full p-0.5">
          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <!-- ช่องว่าง -->
          </div>
          <div class="flex flex-col items-center justify-center w-full h-full p-0.5 ">
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                ลงชื่อ
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5  border-b-2">
                <img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${
      training.TrainingMdApproveBy &&
      training.TrainingMdApproveBy.employeeEmployment &&
      training.TrainingMdApproveBy.employeeEmployment.length > 0
        ? training.TrainingMdApproveBy.employeeEmployment[0].employmentSignature
        : "default_signature.png"
    }" class="w-20 h-20" />
              </div>
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                รับทราบ
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
              (  ${
                training.TrainingMdApproveBy
                  ? `${training.TrainingMdApproveBy.employeeFirstnameTH} ${training.TrainingMdApproveBy.employeeLastnameTH}`
                  : "-"
              })
              </div>
            </div>
            <div class="flex flex-row items-center justify-center w-full h-full p-0.5 ">
              <div class="flex items-center justify-center w-full h-full p-0.5 ">
                กรรมการผู้จัดการ
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
          FM05-WP-HR1-02 / Rev.01 / 20-04-64
        </div>
      `,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="personal_request_${trainingId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
