import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { personalRequestPutSchema } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatPersonalRequestData } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const personalRequestId = parseInt(params.personalRequestId, 10);

    if (!personalRequestId) {
      return NextResponse.json(
        { error: "PersonalRequest ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const personalRequest = await prisma.personalRequest.findMany({
      where: { personalRequestId: personalRequestId },
      include: {
        PersonalRequestCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        PersonalRequestUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!personalRequest?.length) {
      return NextResponse.json(
        { error: "No personalRequest data found" },
        { status: 404 }
      );
    }

    const formattedPersonalRequest = formatPersonalRequestData(personalRequest);

    return NextResponse.json(
      {
        message: "PersonalRequest data retrieved successfully",
        personalRequest: formattedPersonalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving personalRequest data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { personalRequestId } = params;
    if (!personalRequestId) {
      return NextResponse.json(
        { error: "PersonalRequest ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = personalRequestPutSchema.parse({
      ...data,
      personalRequestId,
      personalRequestDesiredDate: new Date(data.personalRequestDesiredDate),
    });

    const localNow = getLocalNow();

    const updatedPersonalRequest = await prisma.personalRequest.update({
      where: { personalRequestId: parseInt(personalRequestId, 10) },
      data: {
        ...parsedData,
        personalRequestUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "PersonalRequest data updated successfully", personalRequest: updatedPersonalRequest },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating personalRequest data");
  }
}
