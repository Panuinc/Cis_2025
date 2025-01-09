import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { departmentPutSchema } from "@/app/api/hr/department/departmentSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatDepartmentData } from "@/app/api/hr/department/departmentSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const departmentId = parseInt(params.departmentId, 10);

    if (!departmentId) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const department = await prisma.department.findMany({
      where: { departmentId: departmentId },
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

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { departmentId } = params;
    if (!departmentId) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = departmentPutSchema.parse({
      ...data,
      departmentId,
    });

    const localNow = getLocalNow();

    const updatedDepartment = await prisma.department.update({
      where: { departmentId: parseInt(departmentId, 10) },
      data: {
        ...parsedData,
        departmentUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "Department data updated successfully",
        department: updatedDepartment,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating department data");
  }
}
