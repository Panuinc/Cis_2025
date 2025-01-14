import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { cvPutSchema } from "@/app/api/hr/cv/cvSchema";
import { formatCvData } from "@/app/api/hr/cv/cvSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    // ดึง IP ผู้ใช้
    ip = getRequestIP(request);

    // รับค่าพารามิเตอร์
    const params = await context.params;
    const cvId = parseInt(params.cvId, 10);

    // ตรวจสอบว่า cvId ถูกต้อง
    if (!cvId) {
      return NextResponse.json({ error: "Cv ID is required" }, { status: 400 });
    }

    // ตรวจสอบ Token และการจำกัดอัตราการใช้งาน
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // ดึงข้อมูลจากฐานข้อมูล
    const cv = await prisma.cv.findMany({
      where: { cvId: cvId },
      include: {
        CvEducation: true,
        // CvProfessionalLicense: true, // Uncomment ถ้าจำเป็น
        // CvWorkHistory: true,         // Uncomment ถ้าจำเป็น
        // CvProject: true,             // Uncomment ถ้าจำเป็น
        CvCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!cv?.length) {
      return NextResponse.json({ error: "No cv data found" }, { status: 404 });
    }

    // แปลงข้อมูลถ้าจำเป็น (ไม่เพิ่มฟิลด์ซ้ำซ้อน)
    const formattedCv = cv.map((item) => {
      const { CvEducation, ...rest } = item;
      return {
        ...rest,
        educations: CvEducation, // แปลงชื่อฟิลด์ (ถ้าจำเป็น)
      };
    });

    // ส่งข้อมูลกลับ
    return NextResponse.json(
      { message: "Cv data retrieved successfully", cv: formattedCv },
      { status: 200 }
    );
  } catch (error) {
    // จัดการข้อผิดพลาด
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
          cvEducationStartDate: edu.cvEducationStartDate,
          cvEducationEndDate: edu.cvEducationEndDate,
        },
      }));

    const creates = (educations || [])
      .filter((edu) => !edu.cvEducationId) // เลือกรายการใหม่ที่ยังไม่มี ID
      .map((edu) => ({
        cvEducationDegree: edu.cvEducationDegree,
        cvEducationInstitution: edu.cvEducationInstitution,
        cvEducationStartDate: edu.cvEducationStartDate,
        cvEducationEndDate: edu.cvEducationEndDate,
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
