import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { employmentTransferPostSchema } from "@/app/api/hr/employment/employmentSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatEmploymentTransferData } from "@/app/api/hr/employmentTransfer/employmentTransferSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    //   const formData = await request.formData();
    //   const data = Object.fromEntries(formData);

    //   const parsedData = employmentTransferPostSchema.parse(data);
    const body = await request.json();

    const parsedData = employmentTransferPostSchema.parse(body);

    //   const existingBranch = await prisma.branch.findFirst({
    //     where: { branchName: parsedData.branchName },
    //   });

    //   if (existingBranch) {
    //     return NextResponse.json(
    //       {
    //         error: `Branch with name '${parsedData.branchName}' already exists.`,
    //       },
    //       { status: 400 }
    //     );
    //   }

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
        message: "Employment Transfer completed successfully",
        updatedCount: result.length,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating employment data in bulk");
  }
}
//       return NextResponse.json(
//         { message: "Successfully created new branch", branch: newBranch },
//         { status: 201 }
//       );
//     } catch (error) {
//       return handleErrors(error, ip, "Error creating branch data");
//     }
//   }
