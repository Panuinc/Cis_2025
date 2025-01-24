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

    const { searchParams } = new URL(request.url);
    const employeeIdParam = searchParams.get("employeeId");
    const employeeId = employeeIdParam ? Number(employeeIdParam) : null;

    // รับ userId จาก headers
    const userId = request.headers.get("user-id");

    // Query ข้อมูล User และ Employee ที่เกี่ยวข้อง
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: {
        UserEmployeeBy: {
          include: {
            employeeEmployment: {
              include: {
                EmploymentBranchId: true,
                EmploymentDivisionId: true,
                EmploymentRoleId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userDivision = user.UserEmployeeBy?.employeeEmployment[0]?.EmploymentDivisionId?.divisionName;
    const userRole = user.UserEmployeeBy?.employeeEmployment[0]?.EmploymentRoleId?.roleName;

    // ดึงข้อมูลลูกน้อง (subordinates) ของผู้ใช้ปัจจุบัน
    const subordinates = await prisma.employment.findMany({
      where: { employmentParentId: user.UserEmployeeBy?.employeeId },
      select: { employmentEmployeeId: true },
    });

    // สร้าง array ของ subordinateIds
    const subordinateIds = subordinates.map((e) => e.employmentEmployeeId);

    let whereCondition = {};

    // Case 1: Owner sees all their requests
    if (employeeId) {
      whereCondition = {
        OR: [
          { personalRequestCreateBy: employeeId }, // Owner sees all their requests
          {
            personalRequestCreateBy: { in: subordinateIds },
            personalRequestStatus: "PendingManagerApprove", // Parent sees only PendingManagerApprove
          },
        ],
      };
    }

    // Case 3: HR Manager sees all requests but can only update PendingHrApprove or PendingManagerApprove for their subordinates
    if (userDivision === "บุคคล" && userRole === "Manager") {
      whereCondition = {}; // HR Manager sees all requests
    }

    // Case 4: MD sees only requests with status PendingMdApprove
    if (userDivision === "บริหาร" && userRole === "MD") {
      whereCondition = {
        personalRequestStatus: "PendingMdApprove",
      };
    }

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

    return NextResponse.json(
      {
        message: "PersonalRequest data retrieved successfully",
        personalRequest,
        subordinateIds, 
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
