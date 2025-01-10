import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { userPutSchema } from "@/app/api/hr/user/userSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatUserData } from "@/app/api/hr/user/userSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";
import bcrypt from "bcryptjs";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const userId = parseInt(params.userId, 10);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const user = await prisma.user.findMany({
      where: { userId: userId },
      include: {
        UserCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        UserUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!user?.length) {
      return NextResponse.json(
        { error: "No user data found" },
        { status: 404 }
      );
    }

    const formattedUser = formatUserData(user);

    return NextResponse.json(
      {
        message: "User data retrieved successfully",
        user: formattedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving user data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { userId } = params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = userPutSchema.parse({
      ...data,
      userId,
    });

    const localNow = getLocalNow();

    const hashedPassword = await bcrypt.hash(parsedData.userPassword, 12);

    const updatedUser = await prisma.user.update({
      where: { userId: parseInt(userId, 10) },
      data: {
        ...parsedData,
        userPassword: hashedPassword,
        userUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "User data updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating user data");
  }
}
