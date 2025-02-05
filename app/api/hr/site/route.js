import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { sitePostSchema } from "@/app/api/hr/site/siteSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatSiteData } from "@/app/api/hr/site/siteSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const site = await prisma.site.findMany({
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

export async function POST(request) {
  let ip;
  try {
    ip = getRequestIP(request);

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = sitePostSchema.parse(data);

    const existingSite = await prisma.site.findFirst({
      where: { siteName: parsedData.siteName },
    });

    if (existingSite) {
      return NextResponse.json(
        {
          error: `Site with name '${parsedData.siteName}' already exists.`,
        },
        { status: 400 }
      );
    }

    const localNow = getLocalNow();

    const newSite = await prisma.site.create({
      data: {
        ...parsedData,
        siteCreateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Successfully created new site", site: newSite },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error creating site data");
  }
}
