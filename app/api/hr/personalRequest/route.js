import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { personalRequestPosteSchema } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatPersonalRequestData } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);
    
    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    // ดึง employeeId จาก query parameters
    const { searchParams } = new URL(request.url);
    const employeeIdParam = searchParams.get("employeeId");
    const employeeId = employeeIdParam ? Number(employeeIdParam) : null;

    let whereCondition = undefined;

    if (employeeId) {
      // ค้นหาลูกน้องที่มี employmentParentId ตรงกับ employeeId
      const subordinates = await prisma.employment.findMany({
        where: { employmentParentId: employeeId },
        select: { employmentEmployeeId: true },
      });

      // สร้างลิสต์ของ subordinate IDs (ไม่รวม parent เอง)
      const subordinateIds = subordinates.map((e) => e.employmentEmployeeId);

      // กำหนดเงื่อนไข where โดยใช้ OR:
      // - เงื่อนไขแรก: เอกสารที่สร้างโดย parent เอง (employeeId)
      // - เงื่อนไขที่สอง: เอกสารที่สร้างโดยลูกน้องและมีสถานะ PendingManagerApprove
      whereCondition = {
        OR: [
          { personalRequestCreateBy: employeeId },
          {
            personalRequestCreateBy: { in: subordinateIds },
            personalRequestStatus: "PendingManagerApprove"
          }
        ]
      };
    }

    // ดึงข้อมูล PersonalRequest โดยใช้เงื่อนไข whereCondition ถ้ามี
    const personalRequest = await prisma.personalRequest.findMany({
      where: whereCondition,
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
          select: {
            employeeId: true,
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

    if (!personalRequest?.length) {
      return NextResponse.json(
        { error: "No personalRequest data found" },
        { status: 404 }
      );
    }

    const formattedPersonalRequest = formatPersonalRequestData(personalRequest);

    return NextResponse.json(
      {
        message: "PersonalRequest data retrieved successfully",
        personalRequest: formattedPersonalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving personalRequest data");
  }
}

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = personalRequestPosteSchema.parse({
      ...data,
      personalRequestDesiredDate: new Date(data.personalRequestDesiredDate),
    });

    const localNow = getLocalNow();
    const day = String(localNow.getDate()).padStart(2, "0");
    const month = String(localNow.getMonth() + 1).padStart(2, "0");
    const year = localNow.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const startOfMonth = new Date(year, localNow.getMonth(), 1);
    const endOfMonth = new Date(year, localNow.getMonth() + 1, 1);

    const countThisMonth = await prisma.personalRequest.count({
      where: {
        personalRequestCreateAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    const sequenceNumber = String(countThisMonth + 1).padStart(2, "0");
    const newDocumentId = `PR-${formattedDate}-${sequenceNumber}`;

    parsedData.personalRequestDocumentId = newDocumentId;

    const localNowTimestamp = getLocalNow();

    const newPersonalRequest = await prisma.personalRequest.create({
      data: {
        ...parsedData,
        personalRequestCreateAt: localNowTimestamp,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully created new personalRequest",
        personalRequest: newPersonalRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating personalRequest data");
  }
}
