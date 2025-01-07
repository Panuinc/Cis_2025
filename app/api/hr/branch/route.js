import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { branchPosteSchema } from "@/app/api/hr/branch/branchSchema";
import { checkRateLimit } from "@/lib/rateLimit";
import logger from "@/lib/logger";
import { verifySecretToken } from "@/lib/auth";

export async function GET(request) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    verifySecretToken(request.headers);

    await checkRateLimit(ip);

    const branch = await prisma.branch.findMany({
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
}

export async function POST(request) {
  let ip;
  try {
    ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";

    verifySecretToken(request.headers);

    logger.info({
      message: "New request received: Creating branch data",
      ip,
      route: "/api/hr/branch",
    });

    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = branchPosteSchema.parse(data);

    logger.info({
      message: "Received data",
      parsedData,
    });

    const existingBranch = await prisma.branch.findFirst({
      where: { branchName: parsedData.branchName },
    });

    if (existingBranch) {
      logger.warn({
        message: "Branch already exists",
        branch: parsedData.branchName,
      });
      return NextResponse.json(
        { error: "This branch already exists" },
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

    logger.info({
      message: "Successfully created new branch data",
      BranchName: newBranch.branchName,
    });

    return NextResponse.json(
      { message: "Successfully created new branch", branch: newBranch },
      { status: 201 }
    );
  } catch (error) {
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
      message: "An error occurred while creating branch data",
      error: error.message,
    });

    return NextResponse.json(
      { error: "An error occurred while creating branch data" },
      { status: 500 }
    );
  }
}
