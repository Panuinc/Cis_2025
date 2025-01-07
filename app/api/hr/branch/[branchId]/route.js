import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { branchPutSchema } from "@/app/api/hr/branch/branchSchema";
import { checkRateLimit } from "@/lib/rateLimit";
import logger from "@/lib/logger";
import { verifySecretToken } from "@/lib/auth";

export async function GET(request, context) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    const params = await context.params;
    const branchId = parseInt(params.branchId, 10);

    if (!branchId) {
      return NextResponse.json(
        { error: "Please provide an ID for the search" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);

    await checkRateLimit(ip);

    const branch = await prisma.branch.findMany({
      where: { branchId: branchId },
      include: {
        BranchCreateBy: {
          select: {
            employee: {
              select: {
                employeeFirstname: true,
                employeeLastname: true,
              },
            },
          },
        },
        BranchUpdateByv: {
          select: {
            employee: {
              select: {
                employeeFirstname: true,
                employeeLastname: true,
              },
            },
          },
        },
      },
    });

    if (!branch || branch.length === 0) {
      return NextResponse.json(
        { error: "No branch data found" },
        { status: 404 }
      );
    }

    const formattedBranch = branch.map((b) => ({
      ...b,
      branchCreateAt: new Date(b.branchCreateAt)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19),
      branchUpdateAt: b.branchUpdateAt
        ? new Date(b.branchUpdateAt)
            .toISOString()
            .replace("T", " ")
            .slice(0, 19)
        : null,
    }));

    return NextResponse.json(
      {
        message: "Branch data retrieved successfully",
        branch: formattedBranch,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip);
  }
}

function handleGetErrors(error, ip) {
  if (error.message === "RateLimitExceeded") {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  if (error.status === 401) {
    return NextResponse.json(
      { error: "Access denied due to missing or invalid token" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { error: "An error occurred while retrieving branch data" },
    { status: 500 }
  );
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    const params = await context.params;
    const branchId = parseInt(params.branchId, 10);

    if (!branchId) {
      return NextResponse.json(
        { error: "Please provide an ID for the update" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);

    logger.info({
      message: "New request received: Updating branch data",
      ip,
      route: `/api/hr/branch/${branchId}`,
    });

    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = branchPutSchema.parse({
      ...data,
      branchId,
    });

    logger.info({
      message: "Received data",
      parsedData,
    });

    const existingBranch = await prisma.branch.findUnique({
      where: { branchId: branchId },
    });

    if (!existingBranch) {
      logger.warn({
        message: "Branch data to update was not found",
        branchId: branchId,
      });
      return NextResponse.json(
        { error: "Branch data to update was not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const offsetMillis = 7 * 60 * 60 * 1000;
    const localNow = new Date(now.getTime() + offsetMillis);
    localNow.setMilliseconds(0);

    const BranchUpdateByv = await prisma.branch.update({
      where: { branchId: branchId },
      data: {
        ...parsedData,
        branchUpdateAt: localNow,
      },
    });

    logger.info({
      message: "Branch data updated successfully",
      BranchName: BranchUpdateByv.branchName,
    });

    return NextResponse.json(
      { message: "Branch data updated successfully", branch: BranchUpdateByv },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip);
  }
}

function handleErrors(error, ip) {
  if (error.message === "RateLimitExceeded") {
    logger.warn({
      message: "Too many requests, please try again later",
      ip,
    });
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  if (error.name === "ZodError") {
    logger.error({
      message: "Invalid data submitted",
      details: error.errors,
    });
    return NextResponse.json(
      {
        error: "Invalid data submitted",
        details: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error.status === 401) {
    return NextResponse.json(
      { error: "Access denied due to missing or invalid token" },
      { status: 401 }
    );
  }

  logger.error({
    message: "An error occurred while updating branch data",
    error: error.message,
  });

  return NextResponse.json(
    { error: "An error occurred while updating branch data" },
    { status: 500 }
  );
}
