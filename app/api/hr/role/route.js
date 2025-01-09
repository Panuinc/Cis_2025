import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { rolePosteSchema } from "@/app/api/hr/role/roleSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatRoleData } from "@/app/api/hr/role/roleSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const role = await prisma.role.findMany({
      include: {
        RoleCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        RoleUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!role?.length) {
      return NextResponse.json(
        { error: "No role data found" },
        { status: 404 }
      );
    }

    const formattedRole = formatRoleData(role);

    return NextResponse.json(
      {
        message: "Role data retrieved successfully",
        role: formattedRole,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving role data");
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

    const parsedData = rolePosteSchema.parse(data);

    const existingRole = await prisma.role.findFirst({
      where: { roleName: parsedData.roleName },
    });

    if (existingRole) {
      return NextResponse.json(
        {
          error: `Role with name '${parsedData.roleName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newRole = await prisma.role.create({
      data: {
        ...parsedData,
        roleCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new role", role: newRole },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating role data");
  }
}
