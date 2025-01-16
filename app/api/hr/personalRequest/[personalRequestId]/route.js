import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import {
  personalRequestPutSchema,
  personalRequestManagerApprovePutSchema,
  personalRequestHrApprovePutSchema,
  personalRequestMdApprovePutSchema,
} from "@/app/api/hr/personalRequest/personalRequestSchema";
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
        PersonalRequestBranchId: {
          select: { branchName: true },
        },
        PersonalRequestDivisionId: {
          select: { divisionName: true },
        },
        PersonalRequestDepartmentId: {
          select: { departmentName: true },
        },
        PersonalRequestPositionId: {
          select: { positionName: true },
        },
        PersonalRequestCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
          select: {
            employeeFirstname: true,
            employeeLastname: true,
            employeeEmployment: {
              select: {
                EmploymentPositionId: { select: { positionName: true } },
                EmploymentDepartmentId: { select: { departmentName: true } },
                employmentSignature: true,
              },
              take: 1,
            },
          },
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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    if (!action) {
      return NextResponse.json(
        { error: "Query parameter 'action' is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const localNow = getLocalNow();

    let parsedData, updateData, message;

    switch (action) {
      case "update":
        parsedData = personalRequestPutSchema.parse({
          ...data,
          personalRequestId,
          personalRequestDesiredDate: new Date(data.personalRequestDesiredDate),
        });
        updateData = {
          ...parsedData,
          personalRequestUpdateAt: localNow,
        };
        message = "PersonalRequest data updated successfully";
        break;

      case "managerApprove":
        parsedData = personalRequestManagerApprovePutSchema.parse({
          ...data,
          personalRequestId,
        });
        updateData = {
          ...parsedData,
          personalRequestReasonManagerApproveAt: localNow,
        };
        message = "PersonalRequest data updated By Manager successfully";
        break;

      case "hrApprove":
        parsedData = personalRequestHrApprovePutSchema.parse({
          ...data,
          personalRequestId,
        });
        updateData = {
          ...parsedData,
          personalRequestReasonHrApproveAt: localNow,
        };
        message = "PersonalRequest data updated By Hr successfully";
        break;

      case "mdApprove":
        parsedData = personalRequestMdApprovePutSchema.parse({
          ...data,
          personalRequestId,
        });
        updateData = {
          ...parsedData,
          personalRequestReasonMdApproveAt: localNow,
        };
        message = "PersonalRequest data updated By Md successfully";
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedPersonalRequest = await prisma.personalRequest.update({
      where: { personalRequestId: parseInt(personalRequestId, 10) },
      data: updateData,
    });

    return NextResponse.json(
      {
        message,
        personalRequest: updatedPersonalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating personalRequest data");
  }
}
