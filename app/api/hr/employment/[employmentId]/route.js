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
import { writeFile } from "fs/promises";
import path from "path";

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

    const parsedEmploymentId = parseInt(employmentId, 10);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employmentPutSchema.parse({
      ...data,
      employmentId: parsedEmploymentId,
      employmentStartWork: new Date(data.employmentStartWork),
    });

    const existingEmployment = await prisma.employment.findUnique({
      where: { employmentId: parsedEmploymentId },
    });

    if (!existingEmployment) {
      return NextResponse.json(
        { error: "Employment data to update was not found" },
        { status: 404 }
      );
    }

    const localNow = getLocalNow();

    const employmentPicture = formData.get("employmentPicture");
    const employmentSignature = formData.get("employmentSignature");

    async function uploadFile(
      file,
      folder,
      existingFileName,
      employmentNumber,
      employmentId
    ) {
      if (!file) {
        return { fileName: existingFileName };
      }

      const fileName = `${employmentNumber}_${employmentId}.png`;
      const filePath = path
        .join("public/images", folder, fileName)
        .replace(/\\/g, "/");
      await writeFile(
        path.join(process.cwd(), filePath),
        Buffer.from(await file.arrayBuffer())
      );
      return { fileName };
    }

    const { fileName: PictureName } = await uploadFile(
      employmentPicture,
      "user_picture",
      existingEmployment.employmentPicture,
      parsedData.employmentNumber,
      parsedEmploymentId
    );

    const { fileName: SignatureName } = await uploadFile(
      employmentSignature,
      "signature",
      existingEmployment.employmentSignature,
      parsedData.employmentNumber,
      parsedEmploymentId
    );

    const updatedEmployment = await prisma.employment.update({
      where: { employmentId: parsedEmploymentId },
      data: {
        ...parsedData,
        employmentPicture: PictureName,
        employmentSignature: SignatureName,
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

    const parsedEmploymentId = parseInt(employmentId, 10);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = employmentPatchSchema.parse({
      ...data,
      employmentId: parsedEmploymentId,
      employmentStartWork: new Date(data.employmentStartWork),
      employmentPassportStartDate: new Date(data.employmentPassportStartDate),
      employmentPassportEndDate: new Date(data.employmentPassportEndDate),
      employmentEnterDate: new Date(data.employmentEnterDate),
      employmentWorkPermitStartDate: new Date(
        data.employmentWorkPermitStartDate
      ),
      employmentWorkPermitEndDate: new Date(data.employmentWorkPermitEndDate),
    });

    const existingEmployment = await prisma.employment.findUnique({
      where: { employmentId: parsedEmploymentId },
    });

    if (!existingEmployment) {
      return NextResponse.json(
        { error: "Employment data to update was not found" },
        { status: 404 }
      );
    }

    const localNow = getLocalNow();

    const employmentPicture = formData.get("employmentPicture");
    const employmentSignature = formData.get("employmentSignature");

    async function uploadFile(
      file,
      folder,
      existingFileName,
      employmentNumber,
      employmentId
    ) {
      if (!file) {
        return { fileName: existingFileName };
      }

      const fileName = `${employmentNumber}_${employmentId}.png`;
      const filePath = path
        .join("public/images", folder, fileName)
        .replace(/\\/g, "/");
      await writeFile(
        path.join(process.cwd(), filePath),
        Buffer.from(await file.arrayBuffer())
      );
      return { fileName };
    }

    const { fileName: PictureName } = await uploadFile(
      employmentPicture,
      "user_picture",
      existingEmployment.employmentPicture,
      parsedData.employmentNumber,
      parsedEmploymentId
    );

    const { fileName: SignatureName } = await uploadFile(
      employmentSignature,
      "signature",
      existingEmployment.employmentSignature,
      parsedData.employmentNumber,
      parsedEmploymentId
    );

    const updatedEmployment = await prisma.employment.update({
      where: { employmentId: parsedEmploymentId },
      data: {
        ...parsedData,
        employmentPicture: PictureName,
        employmentSignature: SignatureName,
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
