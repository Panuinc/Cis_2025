import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import {
  employmentPutSchema,
  employmentPatchSchema,
} from "@/app/api/hr/employment/employmentSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatEmploymentData } from "@/app/api/hr/employment/employmentSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const employmentId = parseInt(params.employmentId, 10);

    if (!employmentId) {
      return NextResponse.json(
        { error: "Employment ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const employment = await prisma.employment.findMany({
      where: { employmentId: employmentId },
      include: {
        EmploymentCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        EmploymentUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        EmploymentEmployeeBy: {
          select: {
            employeeCitizen: true,
          },
        },
      },
    });

    if (!employment?.length) {
      return NextResponse.json(
        { error: "No employment data found" },
        { status: 404 }
      );
    }

    const formattedEmployment = formatEmploymentData(employment);

    return NextResponse.json(
      {
        message: "Employment data retrieved successfully",
        employment: formattedEmployment,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving employment data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { employmentId } = params;
    if (!employmentId) {
      return NextResponse.json(
        { error: "Employment ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employmentPutSchema.parse({
      ...data,
      employmentId,
      employmentStartWork: new Date(data.employmentStartWork),
    });

    const localNow = getLocalNow();

    const updatedEmployment = await prisma.employment.update({
      where: { employmentId: parseInt(employmentId, 10) },
      data: {
        ...parsedData,
        employmentUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "Employment data updated successfully",
        employment: updatedEmployment,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employment data");
  }
}

export async function PATCH(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { employmentId } = params;
    if (!employmentId) {
      return NextResponse.json(
        { error: "Employment ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employmentPatchSchema.parse({
      ...data,
      employmentId,
      employmentStartWork: new Date(data.employmentStartWork),
      employmentPassportStartDate: new Date(data.employmentPassportStartDate),
      employmentPassportEndDate: new Date(data.employmentPassportEndDate),
      employmentEnterDate: new Date(data.employmentEnterDate),
      employmentWorkPermitStartDate: new Date(
        data.employmentWorkPermitStartDate
      ),
      employmentWorkPermitEndDate: new Date(data.employmentWorkPermitEndDate),
    });

    const localNow = getLocalNow();

    const updatedEmployment = await prisma.employment.update({
      where: { employmentId: parseInt(employmentId, 10) },
      data: {
        ...parsedData,
        employmentUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "Employment data updated successfully",
        employment: updatedEmployment,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employment data");
  }
}
