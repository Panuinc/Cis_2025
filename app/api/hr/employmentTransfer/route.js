import { NextResponse } from "next/server";
import { handleErrors } from "@/lib/errorHandler";
import { employmentTransferBulkSchema } from "@/app/api/hr/employmentTransfer/employmentTransferSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const data = await request.json();
    const parsedData = employmentTransferBulkSchema.parse(data);

    const localNow = getLocalNow();

    const operations = parsedData.map((item) => {
      return prisma.employment.update({
        where: { employmentId: item.employmentId },
        data: {
          employmentBranchId: item.employmentBranchId,
          employmentSiteId: item.employmentSiteId,
          employmentDivisionId: item.employmentDivisionId,
          employmentDepartmentId: item.employmentDepartmentId,
          employmentParentId: item.employmentParentId,

          employmentUpdateBy: item.employmentUpdateBy,
          employmentUpdateAt: localNow,
        },
      });
    });

    const result = await prisma.$transaction(operations);

    return NextResponse.json(
      {
        message: "Employment Transfer successfully",
        updatedCount: result.length,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employment data");
  }
}
