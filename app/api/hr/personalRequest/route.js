import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { personalRequestPosteSchema } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatPersonalRequestData } from "@/app/api/hr/personalRequest/personalRequestSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const personalRequest = await prisma.personalRequest.findMany({
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

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = personalRequestPosteSchema.parse(data);

    const existingPersonalRequest = await prisma.personalRequest.findFirst({
      where: { personalRequestAmount: parsedData.personalRequestAmount },
    });

    if (existingPersonalRequest) {
      return NextResponse.json(
        {
          error: `PersonalRequest with name '${parsedData.personalRequestAmount}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newPersonalRequest = await prisma.personalRequest.create({
      data: {
        ...parsedData,
        personalRequestCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new personalRequest", personalRequest: newPersonalRequest },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating personalRequest data");
  }
}
