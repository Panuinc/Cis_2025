import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import {
  empDocumentPutSchema,
  empDocumentPatchSchema,
} from "@/app/api/hr/empDocument/empDocumentSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatEmpDocumentData } from "@/app/api/hr/empDocument/empDocumentSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const empDocumentId = parseInt(params.empDocumentId, 10);

    if (!empDocumentId) {
      return NextResponse.json(
        { error: "EmpDocument ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const empDocument = await prisma.empDocument.findMany({
      where: { empDocumentId: empDocumentId },
      include: {
        EmpDocumentCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        EmpDocumentUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        EmpDocumentEmployeeBy: {
          select: {
            employeeCitizen: true,
          },
        },
      },
    });

    if (!empDocument?.length) {
      return NextResponse.json(
        { error: "No empDocument data found" },
        { status: 404 }
      );
    }

    const formattedEmpDocument = formatEmpDocumentData(empDocument);

    return NextResponse.json(
      {
        message: "EmpDocument data retrieved successfully",
        empDocument: formattedEmpDocument,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving empDocument data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { empDocumentId } = params;
    if (!empDocumentId) {
      return NextResponse.json(
        { error: "EmpDocument ID is required" },
        { status: 400 }
      );
    }

    const parsedEmpDocumentId = parseInt(empDocumentId, 10);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = empDocumentPutSchema.parse({
      ...data,
      empDocumentId: parsedEmpDocumentId,
    });

    const existingEmpDocument = await prisma.empDocument.findUnique({
      where: { empDocumentId: parsedEmpDocumentId },
    });

    if (!existingEmpDocument) {
      return NextResponse.json(
        { error: "EmpDocument data to update was not found" },
        { status: 404 }
      );
    }

    const localNow = getLocalNow();

    const empDocumentIdCardFile = formData.get("empDocumentIdCardFile");
    const empDocumentHomeFile = formData.get("empDocumentHomeFile");

    async function uploadFile(
      file,
      folder,
      existingFileName,
      employmentNumber,
      empDocumentId
    ) {
      if (!file) {
        return { fileName: existingFileName };
      }

      const fileName = `${employmentNumber}_${empDocumentId}.png`;
      const filePath = path
        .join("public/images", folder, fileName)
        .replace(/\\/g, "/");
      await writeFile(
        path.join(process.cwd(), filePath),
        Buffer.from(await file.arrayBuffer())
      );
      return { fileName };
    }

    const { fileName: IdCardName } = await uploadFile(
      empDocumentIdCardFile,
      "idCardFile",
      existingEmpDocument.empDocumentIdCardFile,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: HomeName } = await uploadFile(
      empDocumentHomeFile,
      "homeFile",
      existingEmpDocument.empDocumentHomeFile,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const updatedEmpDocument = await prisma.empDocument.update({
      where: { empDocumentId: parsedEmpDocumentId },
      data: {
        ...parsedData,
        empDocumentIdCardFile: IdCardName,
        empDocumentHomeFile: HomeName,
        empDocumentUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "EmpDocument data updated successfully",
        empDocument: updatedEmpDocument,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating empDocument data");
  }
}

export async function PATCH(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { empDocumentId } = params;
    if (!empDocumentId) {
      return NextResponse.json(
        { error: "EmpDocument ID is required" },
        { status: 400 }
      );
    }

    const parsedEmpDocumentId = parseInt(empDocumentId, 10);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = empDocumentPatchSchema.parse({
      ...data,
      empDocumentId: parsedEmpDocumentId,
    });

    const existingEmpDocument = await prisma.empDocument.findUnique({
      where: { empDocumentId: parsedEmpDocumentId },
    });

    if (!existingEmpDocument) {
      return NextResponse.json(
        { error: "EmpDocument data to update was not found" },
        { status: 404 }
      );
    }

    const localNow = getLocalNow();

    const empDocumentSumFile = formData.get("empDocumentSumFile");
    const empDocumentPassportFile = formData.get("empDocumentPassportFile");
    const empDocumentImmigrationFile = formData.get("empDocumentImmigrationFile");
    const empDocumentVisa1File = formData.get("empDocumentVisa1File");
    const empDocumentVisa2File = formData.get("empDocumentVisa2File");
    const empDocumentVisa3File = formData.get("empDocumentVisa3File");
    const empDocumentVisa4File = formData.get("empDocumentVisa4File");
    const empDocumentVisa5File = formData.get("empDocumentVisa5File");
    const empDocumentWorkPermit1File = formData.get("empDocumentWorkPermit1File");
    const empDocumentWorkPermit2File = formData.get("empDocumentWorkPermit2File");
    const empDocumentWorkPermit3File = formData.get("empDocumentWorkPermit3File");
    const empDocumentWorkPermit4File = formData.get("empDocumentWorkPermit4File");
    const empDocumentWorkPermit5File = formData.get("empDocumentWorkPermit5File");

    async function uploadFile(
      file,
      folder,
      existingFileName,
      employmentNumber,
      empDocumentId
    ) {
      if (!file) {
        return { fileName: existingFileName };
      }

      const fileName = `${employmentNumber}_${empDocumentId}.png`;
      const filePath = path
        .join("public/images", folder, fileName)
        .replace(/\\/g, "/");
      await writeFile(
        path.join(process.cwd(), filePath),
        Buffer.from(await file.arrayBuffer())
      );
      return { fileName };
    }

    const { fileName: SumName } = await uploadFile(
      empDocumentSumFile,
      "sumFile",
      existingEmpDocument.empDocumentSumFile,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: PassportName } = await uploadFile(
      empDocumentPassportFile,
      "passportFile",
      existingEmpDocument.empDocumentPassportFile,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: ImmigrationName } = await uploadFile(
      empDocumentImmigrationFile,
      "immigrationFile",
      existingEmpDocument.empDocumentImmigrationFile,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: Visa1Name } = await uploadFile(
      empDocumentVisa1File,
      "visa1File",
      existingEmpDocument.empDocumentVisa1File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: Visa2Name } = await uploadFile(
      empDocumentVisa2File,
      "visa2File",
      existingEmpDocument.empDocumentVisa2File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: Visa3Name } = await uploadFile(
      empDocumentVisa3File,
      "visa3File",
      existingEmpDocument.empDocumentVisa3File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: Visa4Name } = await uploadFile(
      empDocumentVisa4File,
      "visa4File",
      existingEmpDocument.empDocumentVisa4File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: Visa5Name } = await uploadFile(
      empDocumentVisa5File,
      "visa5File",
      existingEmpDocument.empDocumentVisa5File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: WorkPermit1Name } = await uploadFile(
      empDocumentWorkPermit1File,
      "workPermit1File",
      existingEmpDocument.empDocumentWorkPermit1File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: WorkPermit2Name } = await uploadFile(
      empDocumentWorkPermit2File,
      "workPermit2File",
      existingEmpDocument.empDocumentWorkPermit2File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: WorkPermit3Name } = await uploadFile(
      empDocumentWorkPermit3File,
      "workPermit3File",
      existingEmpDocument.empDocumentWorkPermit3File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: WorkPermit4Name } = await uploadFile(
      empDocumentWorkPermit4File,
      "workPermit4File",
      existingEmpDocument.empDocumentWorkPermit4File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const { fileName: WorkPermit5Name } = await uploadFile(
      empDocumentWorkPermit5File,
      "workPermit5File",
      existingEmpDocument.empDocumentWorkPermit5File,
      parsedData.employmentNumber,
      parsedEmpDocumentId
    );

    const updatedEmpDocument = await prisma.empDocument.update({
      where: { empDocumentId: parsedEmpDocumentId },
      data: {
        ...parsedData,
        empDocumentSumFile: SumName,
        empDocumentPassportFile: PassportName,
        empDocumentImmigrationFile: ImmigrationName,
        empDocumentVisa1File: Visa1Name,
        empDocumentVisa2File: Visa2Name,
        empDocumentVisa3File: Visa3Name,
        empDocumentVisa4File: Visa4Name,
        empDocumentVisa5File: Visa5Name,
        empDocumentWorkPermit1File: WorkPermit1Name,
        empDocumentWorkPermit2File: WorkPermit2Name,
        empDocumentWorkPermit3File: WorkPermit3Name,
        empDocumentWorkPermit4File: WorkPermit4Name,
        empDocumentWorkPermit5File: WorkPermit5Name,
        empDocumentUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "EmpDocument data updated successfully",
        empDocument: updatedEmpDocument,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating empDocument data");
  }
}
