import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { divisionPutSchema } from "@/app/api/hr/division/divisionSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatDivisionData } from "@/app/api/hr/division/divisionSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const divisionId = parseInt(params.divisionId, 10);

    if (!divisionId) {
      return NextResponse.json(
        { error: "Division ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const division = await prisma.division.findMany({
      where: { divisionId: divisionId },
      include: {
        DivisionBranchId: {
          select: { branchName: true },
        },
        DivisionCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        DivisionUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!division?.length) {
      return NextResponse.json(
        { error: "No division data found" },
        { status: 404 }
      );
    }

    const formattedDivision = formatDivisionData(division);

    return NextResponse.json(
      {
        message: "Division data retrieved successfully",
        division: formattedDivision,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving division data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { divisionId } = params;
    if (!divisionId) {
      return NextResponse.json(
        { error: "Division ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = divisionPutSchema.parse({
      ...data,
      divisionId,
    });

    const localNow = getLocalNow();

    const updatedDivision = await prisma.division.update({
      where: { divisionId: parseInt(divisionId, 10) },
      data: {
        ...parsedData,
        divisionUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Division data updated successfully", division: updatedDivision },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating division data");
  }
}
