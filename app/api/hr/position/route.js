import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { positionPosteSchema } from "@/app/api/hr/position/positionSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatPositionData } from "@/app/api/hr/position/positionSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const position = await prisma.position.findMany({
      include: { 
        PositionBranchId: {
          select: { branchName: true },
        },
        PositionDivisionId: {
          select: { divisionName: true },
        },
        PositionDepartmentId: {
          select: { departmentName: true },
        },
        PositionCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        PositionUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!position?.length) {
      return NextResponse.json(
        { error: "No position data found" },
        { status: 404 }
      );
    }

    const formattedPosition = formatPositionData(position);

    return NextResponse.json(
      {
        message: "Position data retrieved successfully",
        position: formattedPosition,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving position data");
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

    const parsedData = positionPosteSchema.parse(data);

    const existingPosition = await prisma.position.findFirst({
      where: { positionName: parsedData.positionName },
    });

    if (existingPosition) {
      return NextResponse.json(
        {
          error: `Position with name '${parsedData.positionName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newPosition = await prisma.position.create({
      data: {
        ...parsedData,
        positionCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new position", position: newPosition },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating position data");
  }
}
