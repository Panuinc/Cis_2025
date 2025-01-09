import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { divisionPosteSchema } from "@/app/api/hr/division/divisionSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatDivisionData } from "@/app/api/hr/division/divisionSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const division = await prisma.division.findMany({
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

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = divisionPosteSchema.parse(data);

    const existingDivision = await prisma.division.findFirst({
      where: { divisionName: parsedData.divisionName },
    });

    if (existingDivision) {
      return NextResponse.json(
        {
          error: `Division with name '${parsedData.divisionName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newDivision = await prisma.division.create({
      data: {
        ...parsedData,
        divisionCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new division", division: newDivision },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating division data");
  }
}
