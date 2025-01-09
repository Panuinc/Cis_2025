import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { branchPosteSchema } from "@/app/api/hr/branch/branchSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatBranchData } from "@/app/api/hr/branch/branchSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const branch = await prisma.branch.findMany({
      include: {
        BranchCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        BranchUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!branch?.length) {
      return NextResponse.json(
        { error: "No branch data found" },
        { status: 404 }
      );
    }

    const formattedBranch = formatBranchData(branch);

    return NextResponse.json(
      {
        message: "Branch data retrieved successfully",
        branch: formattedBranch,
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
    ip = getRequestIP(request);

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

    const localNow = getLocalNow();

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
