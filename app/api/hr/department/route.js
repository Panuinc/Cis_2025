import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { departmentPostSchema } from "@/app/api/hr/department/departmentSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatDepartmentData } from "@/app/api/hr/department/departmentSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const department = await prisma.department.findMany({
      include: { 
        DepartmentBranchId: {
          select: { branchName: true },
        },
        DepartmentDivisionId: {
          select: { divisionName: true },
        },
        DepartmentCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        DepartmentUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!department?.length) {
      return NextResponse.json(
        { error: "No department data found" },
        { status: 404 }
      );
    }

    const formattedDepartment = formatDepartmentData(department);

    return NextResponse.json(
      {
        message: "Department data retrieved successfully",
        department: formattedDepartment,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving department data");
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

    const parsedData = departmentPostSchema.parse(data);

    const existingDepartment = await prisma.department.findFirst({
      where: { departmentName: parsedData.departmentName },
    });

    if (existingDepartment) {
      return NextResponse.json(
        {
          error: `Department with name '${parsedData.departmentName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newDepartment = await prisma.department.create({
      data: {
        ...parsedData,
        departmentCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new department", department: newDepartment },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating department data");
  }
}
