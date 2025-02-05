import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { sitePutSchema } from "@/app/api/hr/site/siteSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatSiteData } from "@/app/api/hr/site/siteSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const siteId = parseInt(params.siteId, 10);

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const site = await prisma.site.findMany({
      where: { siteId: siteId },
      include: {
        SiteBranchId: {
          select: { branchName: true },
        },
        SiteCreateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
        SiteUpdateBy: {
          select: { employeeFirstnameTH: true, employeeLastnameTH: true },
        },
      },
    });

    if (!site?.length) {
      return NextResponse.json(
        { error: "No site data found" },
        { status: 404 }
      );
    }

    const formattedSite = formatSiteData(site);

    return NextResponse.json(
      {
        message: "Site data retrieved successfully",
        site: formattedSite,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving site data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { siteId } = params;
    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = sitePutSchema.parse({
      ...data,
      siteId,
    });

    const localNow = getLocalNow();

    const updatedSite = await prisma.site.update({
      where: { siteId: parseInt(siteId, 10) },
      data: {
        ...parsedData,
        siteUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Site data updated successfully", site: updatedSite },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating site data");
  }
}
