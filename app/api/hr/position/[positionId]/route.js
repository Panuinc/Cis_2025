import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { positionPutSchema } from "@/app/api/hr/position/positionSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatPositionData } from "@/app/api/hr/position/positionSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const positionId = parseInt(params.positionId, 10);

    if (!positionId) {
      return NextResponse.json(
        { error: "Position ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const position = await prisma.position.findMany({
      where: { positionId: positionId },
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

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { positionId } = params;
    if (!positionId) {
      return NextResponse.json(
        { error: "Position ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = positionPutSchema.parse({
      ...data,
      positionId,
    });

    const localNow = getLocalNow();

    const updatedPosition = await prisma.position.update({
      where: { positionId: parseInt(positionId, 10) },
      data: {
        ...parsedData,
        positionUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      {
        message: "Position data updated successfully",
        position: updatedPosition,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating position data");
  }
}
