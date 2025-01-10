import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { employeePutSchema } from "@/app/api/hr/employee/employeeSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatEmployeeData } from "@/app/api/hr/employee/employeeSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const employeeId = parseInt(params.employeeId, 10);

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const employee = await prisma.employee.findMany({
      where: { employeeId: employeeId },
      include: {
        employeeUser: true,
        employeeEmployment: {
          include: {
            EmploymentBranchId: {
              select: { branchName: true },
            },
            EmploymentSiteId: {
              select: { siteName: true },
            },
            EmploymentDivisionId: {
              select: { divisionName: true },
            },
            EmploymentDepartmentId: {
              select: { departmentName: true },
            },
            EmploymentPositionId: {
              select: { positionName: true },
            },
            EmploymentRoleId: {
              select: { roleName: true },
            },
            EmploymentParentBy: {
              select: { employeeFirstname: true, employeeLastname: true },
            },
          },
        },
        employeeEmpDocument: true,
        EmployeeCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        EmployeeUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!employee?.length) {
      return NextResponse.json(
        { error: "No employee data found" },
        { status: 404 }
      );
    }

    const formattedEmployee = formatEmployeeData(employee);

    return NextResponse.json(
      {
        message: "Employee data retrieved successfully",
        employee: formattedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving employee data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { employeeId } = params;
    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employeePutSchema.parse({
      ...data,
      employeeId,
      employeeBirthday: new Date(data.employeeBirthday),
    });

    const localNow = getLocalNow();

    const updatedEmployee = await prisma.employee.update({
      where: { employeeId: parseInt(employeeId, 10) },
      data: {
        ...parsedData,
        employeeUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "Employee data updated successfully",
        employee: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employee data");
  }
}
