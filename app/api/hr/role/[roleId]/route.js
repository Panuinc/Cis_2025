import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { rolePutSchema } from "@/app/api/hr/role/roleSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatRoleData } from "@/app/api/hr/role/roleSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const roleId = parseInt(params.roleId, 10);

    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const role = await prisma.role.findMany({
      where: { roleId: roleId },
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

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { roleId } = params;
    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = rolePutSchema.parse({
      ...data,
      roleId,
    });

    const localNow = getLocalNow();

    const updatedRole = await prisma.role.update({
      where: { roleId: parseInt(roleId, 10) },
      data: {
        ...parsedData,
        roleUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Role data updated successfully", role: updatedRole },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating role data");
  }
}
