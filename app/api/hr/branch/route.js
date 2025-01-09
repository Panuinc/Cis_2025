import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { branchPosteSchema } from "@/app/api/hr/branch/branchSchema";
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

export async function GET(request) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const branches = await prisma.branch.findMany({
      include: {
        BranchCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        BranchUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!branches || branches.length === 0) {
      return NextResponse.json(
        { error: "No branch data found" },
        { status: 404 }
      );
    }

    const formattedBranches = formatBranchData(branches);

    return NextResponse.json(
      {
        message: "Branch data retrieved successfully",
        branches: formattedBranches,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving branch data");
  }
}

export async function POST(request) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = branchPosteSchema.parse(data);

    const existingBranch = await prisma.branch.findFirst({
      where: { branchName: parsedData.branchName },
    });

    if (existingBranch) {
      return NextResponse.json(
        {
          error: `Branch with name '${parsedData.branchName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const offsetMillis = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + offsetMillis);
    localNow.setMilliseconds(0);

    const newBranch = await prisma.branch.create({
      data: {
        ...parsedData,
        branchCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new branch", branch: newBranch },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating branch data");
  }
}
