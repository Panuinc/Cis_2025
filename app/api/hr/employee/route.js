import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { employeePosteSchema } from "@/app/api/hr/employee/employeeSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatEmployeeData } from "@/app/api/hr/employee/employeeSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const employee = await prisma.employee.findMany({
      include: { 
        EmployeeBranchId: {
          select: { branchName: true },
        },
        EmployeeDivisionId: {
          select: { divisionName: true },
        },
        EmployeeDepartmentId: {
          select: { departmentName: true },
        },
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

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employeePosteSchema.parse(data);

    const existingEmployee = await prisma.employee.findFirst({
      where: { employeeName: parsedData.employeeName },
    });

    if (existingEmployee) {
      return NextResponse.json(
        {
          error: `Employee with name '${parsedData.employeeName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newEmployee = await prisma.employee.create({
      data: {
        ...parsedData,
        employeeCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new employee", employee: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating employee data");
  }
}