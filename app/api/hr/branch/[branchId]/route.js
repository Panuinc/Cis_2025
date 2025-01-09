import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { branchPutSchema } from "@/app/api/hr/branch/branchSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

function formatBranchData(branch) {
  return branch.map((b) => ({
    ...b,
    branchCreateAt: new Date(b.branchCreateAt)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19),
    branchUpdateAt: b.branchUpdateAt
      ? new Date(b.branchUpdateAt).toISOString().replace("T", " ").slice(0, 19)
      : null,
  }));
}

export async function GET(request, context) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    const params = await context.params;
    const branchId = parseInt(params.branchId, 10);

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const branch = await prisma.branch.findMany({
      where: { branchId: branchId },
      include: {
        BranchCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        BranchUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const formattedBranch = formatBranchData([branch]);

    return NextResponse.json(
      {
        message: "Branch data retrieved successfully",
        branch: formattedBranch[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving branch data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    const { branchId } = context.params;
    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = branchPutSchema.parse({
      ...data,
      branchId,
    });
    const now = new Date();
    const offsetMillis = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + offsetMillis);
    localNow.setMilliseconds(0);

    const updatedBranch = await prisma.branch.update({
      where: { branchId: parseInt(branchId, 10) },
      data: {
        ...parsedData,
        branchUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Branch data updated successfully", branch: updatedBranch },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating branch data");
  }
}
