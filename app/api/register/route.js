import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/app/api/register/registerSchema";
import { checkRateLimit } from "@/lib/rateLimit";
import logger from "@/lib/logger";
import { verifySecretToken } from "@/lib/auth";

export async function POST(request) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    verifySecretToken(request.headers);

    logger.info({
      message: "New Request",
      ip,
      route: "/api/register",
    });

    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = registerSchema.parse({
      ...data,
      employeeBirthday: new Date(data.employeeBirthday),
    });

    logger.info({
      message: "Submitted Data",
      parsedData,
    });

    const existingEmployee = await prisma.employee.findFirst({
      where: { employeeIdCard: parsedData.employeeIdCard },
    });

    if (existingEmployee) {
      logger.warn({
        message: "This Account Already Exists",
        employee: parsedData.employeeIdCard,
      });
      return NextResponse.json(
        { error: "This Account Already Exists" },
        { status: 400 }
      );
    }

    const now = new Date();
    const offsetMillis = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + offsetMillis);
    localNow.setMilliseconds(0);

    const newEmployee = await prisma.employee.create({
      data: {
        ...parsedData,
        employeeCreateBy: 1,
        employeeCreateAt: localNow,
      },
    });

    await prisma.user.create({
      data: {
        userEmployeeId: newEmployee.employeeId,
        userCreateBy: 1,
        userCreateAt: localNow,
      },
    });

    await prisma.employment.create({
      data: {
        employmentEmployeeId: newEmployee.employeeId,
        employmentCreateBy: 1,
        employmentCreateAt: localNow,
      },
    });

    await prisma.empDocument.create({
      data: {
        empDocumentEmployeeId: newEmployee.employeeId,
        empDocumentCreateBy: 1,
        empDocumentCreateAt: localNow,
      },
    });

    logger.info({
      message: "Account Registration Successful",
      EmployeeFullName: `${newEmployee.employeeFirstname} ${newEmployee.employeeLastname}`,
    });

    return NextResponse.json(
      { message: "Account Registration Successful", employee: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    if (error.message === "RateLimitExceeded") {
      logger.warn({
        message: "Too Many Requests. Please Try Again Later",
        ip,
      });
      return NextResponse.json(
        { error: "oo Many Requests. Please Try Again Later" },
        { status: 429 }
      );
    }

    if (error.name === "ZodError") {
      logger.error({
        message: "Validation Error",
        details: error.errors,
      });
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.errors.map((e) => ({
            field: e.path,
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "Access Denied Due To An Invalid Or Missing Token" },
        { status: 401 }
      );
    }

    logger.error({
      message: "An Error Occurred",
      error: error.message,
    });

    console.error("Error In Register Route:", error.message);
    return NextResponse.json({ error: "An Error Occurred" }, { status: 500 });
  }
}
