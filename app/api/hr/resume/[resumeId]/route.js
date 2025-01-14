import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { resumePutSchema } from "@/app/api/hr/resume/resumeSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { formatResumeData } from "@/app/api/hr/resume/resumeSchema";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const resumeId = parseInt(params.resumeId, 10);

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const resume = await prisma.resume.findMany({
      where: { resumeId: resumeId },
      include: {
        ResumeCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        ResumeUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!resume?.length) {
      return NextResponse.json(
        { error: "No resume data found" },
        { status: 404 }
      );
    }

    const formattedResume = formatResumeData(resume);

    return NextResponse.json(
      {
        message: "Resume data retrieved successfully",
        resume: formattedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving resume data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { resumeId } = params;
    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsedData = resumePutSchema.parse({
      ...data,
      resumeId,
    });

    const localNow = getLocalNow();

    const updatedResume = await prisma.resume.update({
      where: { resumeId: parseInt(resumeId, 10) },
      data: {
        ...parsedData,
        resumeUpdateAt: localNow,
      },
    });

    return NextResponse.json(
      { message: "Resume data updated successfully", resume: updatedResume },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating resume data");
  }
}
