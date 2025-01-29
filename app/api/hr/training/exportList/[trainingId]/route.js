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
                employeeId: true, // เพิ่มการเลือก employeeId
                employeeFirstname: true,
                employeeLastname: true,
                employeeEmployment: {
                  select: {
                    EmploymentPositionId: { select: { positionName: true } },
                    EmploymentDivisionId: { select: { divisionName: true } },
                    employmentSignature: true, // เลือกลายเซ็น
                  },
                  take: 1, // จำกัดให้เลือกแค่ 1 รายการ
                },
              },
            },
          },
        },
        employeeTrainingCheckInTraining: {
          include: {
            TrainingEmployeeCheckInEmployeeId: {
              select: {
                employeeId: true, // เพิ่มการเลือก employeeId
                employeeFirstname: true,
                employeeLastname: true,
                employeeEmployment: {
                  select: {
                    employmentSignature: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
        TrainingCreateBy: {
          select: {
            employeeFirstname: true,
            employeeLastname: true,
            employeeEmployment: {
              select: {
                employmentSignature: true,
              },
              take: 1,
            },
          },
        },
        TrainingUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        TrainingHrApproveBy: {
          select: {
            employeeFirstname: true,
            employeeLastname: true,
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
            employeeFirstname: true,
            employeeLastname: true,
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

    // การจัดรูปแบบวันที่เริ่มและสิ้นสุด
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
            .map((item, index) => {
              // ค้นหาข้อมูลการเช็คอินสำหรับพนักงานคนนี้
              const checkIn = training.employeeTrainingCheckInTraining.find(
                (ci) =>
                  ci.TrainingEmployeeCheckInEmployeeId.employeeId ===
                  item.TrainingEmployeeEmployeeId.employeeId
              );

              // ตรวจสอบการเช็คอินเช้า
              const morningCheck =
                checkIn && checkIn.trainingEmployeeCheckInMorningCheck
                  ? `<img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${checkIn.TrainingEmployeeCheckInEmployeeId.employeeEmployment[0]?.employmentSignature}" alt="Signature" class="w-16 h-auto" />`
                  : "-";

              // ตรวจสอบการเช็คอินบ่าย
              const afternoonCheck =
                checkIn && checkIn.trainingEmployeeCheckInAfterNoonCheck
                  ? `<img src="${process.env.NEXT_PUBLIC_API_URL}/images/signature/${checkIn.TrainingEmployeeCheckInEmployeeId.employeeEmployment[0]?.employmentSignature}" alt="Signature" class="w-16 h-auto" />`
                  : "-";

              // ตรวจสอบผลการอบรม
              const passMark =
                item.trainingEmployeeResult === "Pass" ? "✔️" : "";
              const notPassMark =
                item.trainingEmployeeResult === "Not_Pass" ? "❌" : "";

              return `
              <tr>
                <td class="border px-4 py-2 text-center">${index + 1}</td>
                <td class="border px-4 py-2">${
                  item.TrainingEmployeeEmployeeId.employeeFirstname
                } ${item.TrainingEmployeeEmployeeId.employeeLastname}</td>
                <td class="border px-4 py-2">${
                  item.TrainingEmployeeEmployeeId.employeeEmployment[0]
                    ?.EmploymentPositionId?.positionName || "-"
                }</td>
                <td class="border px-4 py-2">${
                  item.TrainingEmployeeEmployeeId.employeeEmployment[0]
                    ?.EmploymentDivisionId?.divisionName || "-"
                }</td>
                <td class="border px-4 py-2">${morningCheck}</td>
                <td class="border px-4 py-2">${afternoonCheck}</td>
                <td class="border px-4 py-2 text-center">${passMark}</td>
                <td class="border px-4 py-2 text-center">${notPassMark}</td>
              </tr>
            `;
            })
            .join("")
        : `
            <tr>
              <td class="border px-4 py-2 text-center" colspan="8">ไม่มีข้อมูล</td>
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
      
      <div class="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <!-- ส่วนหัวของเอกสาร -->
        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
          <div class="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <img src="${
              process.env.NEXT_PUBLIC_API_URL
            }/images/company_logo/company_logo.png" class="w-28 min-h-28" />
          </div>
          <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed text-3xl font-[900]">
            แบบลงทะเบียนและการประเมินผลการฝึกอบรม
          </div>
        </div>

        <!-- ข้อมูลหลักสูตร -->
        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              หลักสูตร
            </div>
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
              ${training.trainingName || "-"}
            </div>
          </div>
        </div>       

        <!-- ระยะเวลา -->
        <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
             ระยะเวลา
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
              ${formattedStartDate}
            </div>
          </div>
          <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              ถึง
            </div>
          </div>
           <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
              ${formattedEndDate}
            </div>
          </div>
        </div>  

        <!-- สถานที่ -->
          <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
           <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
             <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              สถานที่
             </div>
             <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
               ${training.trainingLocation || "-"}
             </div>
           </div>
         </div>
         
         <!-- วิทยากร -->
         <div class="flex flex-row items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
           <div class="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
             <div class="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
             วิทยากร
             </div>
             <div class="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed ">
               ${training.trainingLecturer || "-"}
             </div>
           </div>
         </div>  
         
         <!-- ตารางข้อมูลพนักงาน -->
         <div class="flex flex-col items-center justify-center w-full p-2 gap-2 border-2 border-dark border-dashed">
           <table class="min-w-full border-collapse">
             <thead class="bg-gray-200">
               <tr>
                 <th class="border px-4 py-2">ลำดับ</th>
                 <th class="border px-4 py-2">ชื่อ - นามสกุล</th>
                 <th class="border px-4 py-2">ตำแหน่ง</th>
                 <th class="border px-4 py-2">แผนก</th>
                 <th class="border px-4 py-2">ลงชื่อเช้า</th>
                 <th class="border px-4 py-2">ลงชื่อบ่าย</th>
                 <th class="border px-4 py-2">ผ่าน</th>
                 <th class="border px-4 py-2">ไม่ผ่าน</th>
               </tr>
             </thead>
             <tbody>
               ${employeeTableRows}
             </tbody>
           </table>
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
