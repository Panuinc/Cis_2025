import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { cvPutSchema } from "@/app/api/hr/cv/cvSchema";
import { formatCvData } from "@/app/api/hr/cv/cvSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
// import { formatDepartmentData } from "@/app/api/hr/department/departmentSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const cvId = parseInt(params.cvId, 10);

    if (!cvId) {
      return NextResponse.json({ error: "Cv ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cv = await prisma.cv.findMany({
      where: { cvId: cvId },
      include: {
        CvEducation: true,
        // CvProfessionalLicense: true,
        // CvWorkHistory: true,
        // CvProject: true,
        CvCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!cv?.length) {
      return NextResponse.json({ error: "No cv data found" }, { status: 404 });
    }

    const formattedCv = formatCvData(cv);

    return NextResponse.json(
      { message: "Cv data retrieved successfully", cv: formattedCv },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving cv data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { cvId } = params;
    if (!cvId) {
      return NextResponse.json({ error: "Cv ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // รับข้อมูลจาก formData และแปลงค่าบางอย่างตามต้องการ
    const formData = await request.formData();
    const dataObj = {};
    for (const [key, value] of formData.entries()) {
      if (
        ["educations" /*, "licenses", "workHistories", "projects"*/].includes(
          key
        )
      ) {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    // ตรวจสอบและ parse ข้อมูลด้วย schema
    const parsedData = cvPutSchema.parse({
      ...dataObj,
      cvId,
    });

    const { educations, /* licenses, workHistories, projects, */ ...cvData } =
      parsedData;
    const localNow = getLocalNow();

    // แยกข้อมูลการศึกษาออกเป็นสองกลุ่ม สำหรับการอัปเดตและการสร้างใหม่
    const updates = (educations || [])
      .filter((edu) => edu.cvEducationId) // เลือกรายการที่มี ID อยู่แล้ว
      .map((edu) => ({
        where: { cvEducationId: edu.cvEducationId },
        data: {
          cvEducationDegree: edu.cvEducationDegree,
          cvEducationInstitution: edu.cvEducationInstitution,
          cvEducationStartDate: edu.cvEducationStartDate
            ? new Date(edu.cvEducationStartDate).getFullYear().toString()
            : null,
          cvEducationEndDate: edu.cvEducationEndDate
            ? new Date(edu.cvEducationEndDate).getFullYear().toString()
            : null,
        },
      }));

    const creates = (educations || [])
      .filter((edu) => !edu.cvEducationId) // เลือกรายการใหม่ที่ยังไม่มี ID
      .map((edu) => ({
        cvEducationDegree: edu.cvEducationDegree,
        cvEducationInstitution: edu.cvEducationInstitution,
        cvEducationStartDate: edu.cvEducationStartDate
          ? new Date(edu.cvEducationStartDate).getFullYear().toString()
          : null,
        cvEducationEndDate: edu.cvEducationEndDate
          ? new Date(edu.cvEducationEndDate).getFullYear().toString()
          : null,
      }));

    // อัปเดตข้อมูล CV พร้อมกับ nested write สำหรับ CvEducation
    const updatedCv = await prisma.cv.update({
      where: { cvId: parseInt(cvId, 10) },
      data: {
        ...cvData,
        cvUpdateAt: localNow,
        CvEducation: {
          update: updates, // อัปเดตรายการที่มีอยู่แล้ว
          create: creates, // สร้างรายการใหม่
        },
        // หากมี relations อื่น ๆ (licenses, workHistories, projects) สามารถจัดการแบบเดียวกันได้
      },
    });

    return NextResponse.json(
      { message: "Cv data updated successfully", cv: updatedCv },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating cv data");
  }
}
