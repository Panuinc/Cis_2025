import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { cvENPutSchema } from "@/app/api/hr/cvEN/cvENSchema";
import { formatCvENData } from "@/app/api/hr/cvEN/cvENSchema";
import { verifySecretToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prisma";
import { getRequestIP } from "@/lib/GetRequestIp";
import { getLocalNow } from "@/lib/GetLocalNow";

export async function GET(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const cvENId = parseInt(params.cvENId, 10);

    if (!cvENId) {
      return NextResponse.json({ error: "CvEN ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cvEN = await prisma.cvEN.findMany({
      where: { cvENId: cvENId },
      include: {
        CvENEmployeeBy: true,
        CvENEducation: true,
        CvENLicense: true,
        CvENWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvENLanguageSkill: true,
        CvENCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvENUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!cvEN?.length) {
      return NextResponse.json({ error: "No cvEN data found" }, { status: 404 });
    }

    const formattedCvEN = cvEN.map((item) => {
      const {
        CvENEducation,
        CvENLicense,
        CvENWorkHistory,
        CvENLanguageSkill,
        CvENEmployeeBy,
        ...rest
      } = item;

      const formattedEmployee = CvENEmployeeBy
        ? {
            ...CvENEmployeeBy,
            employeeBirthday: CvENEmployeeBy.employeeBirthday
              ? CvENEmployeeBy.employeeBirthday.toISOString().split("T")[0]
              : null,
          }
        : null;

      const formattedWorkHistories = CvENWorkHistory.map((history) => {
        const { projects, ...historyRest } = history;
        return {
          ...historyRest,
          projects,
        };
      });

      return {
        ...rest,
        employee: formattedEmployee,
        educations: CvENEducation,
        licenses: CvENLicense,
        workHistories: formattedWorkHistories,
        languageSkills: CvENLanguageSkill,
      };
    });

    return NextResponse.json(
      { message: "CvEN data retrieved successfully", cvEN: formattedCvEN },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving cvEN data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { cvENId } = params;
    if (!cvENId) {
      return NextResponse.json({ error: "CvEN ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const formData = await request.formData();
    let dataObj = {};
    for (const [key, value] of formData.entries()) {
      if (
        ["educations", "licenses", "workHistories", "languageSkills"].includes(
          key
        )
      ) {
        dataObj[key] = JSON.parse(value);
      } else {
        dataObj[key] = value;
      }
    }

    const parsedData = cvENPutSchema.parse({
      ...dataObj,
      cvENId,
    });

    const { educations, licenses, workHistories, languageSkills, ...cvENData } =
      parsedData;

    const localNow = getLocalNow();

    function processEntries(entries, idKey, fields) {
      const update = (entries || [])
        .filter((e) => e[idKey])
        .map((e) => ({
          where: { [idKey]: e[idKey] },
          data: Object.fromEntries(fields.map((field) => [field, e[field]])),
        }));

      const create = (entries || [])
        .filter((e) => !e[idKey])
        .map((e) =>
          Object.fromEntries(fields.map((field) => [field, e[field]]))
        );

      return { update, create };
    }

    // Education
    const educationFields = [
      "cvENEducationDegree",
      "cvENEducationInstitution",
      "cvENEducationStartDate",
      "cvENEducationEndDate",
    ];
    const { update: updateEducation, create: createEducation } = processEntries(
      educations,
      "cvENEducationId",
      educationFields
    );

    // License
    const licenseFields = [
      "cvENProfessionalLicenseName",
      "cvENProfessionalLicenseNumber",
      "cvENProfessionalLicenseStartDate",
      "cvENProfessionalLicenseEndDate",
    ];
    const { update: updateLicense, create: createLicense } = processEntries(
      licenses,
      "cvENProfessionalLicenseId",
      licenseFields
    );

    // WorkHistory (มี projects ข้างใน)
    const workHistoryFields = [
      "cvENWorkHistoryCompanyName",
      "cvENWorkHistoryPosition",
      "cvENWorkHistoryStartDate",
      "cvENWorkHistoryEndDate",
    ];
    const projectFields = ["cvENProjectName", "cvENProjectDescription"];

    const updateWorkHistories = (workHistories || [])
      .filter((e) => e.cvENWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        // process projects
        const { update: updateProjects, create: createProjects } =
          processEntries(projects, "cvENProjectId", projectFields);

        return {
          where: { cvENWorkHistoryId: e.cvENWorkHistoryId },
          data: {
            ...Object.fromEntries(
              workHistoryFields.map((field) => [field, historyData[field]])
            ),
            projects: {
              update: updateProjects,
              create: createProjects,
            },
          },
        };
      });

    const createWorkHistories = (workHistories || [])
      .filter((e) => !e.cvENWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        const { create: createProjects } = processEntries(
          projects,
          "cvENProjectId",
          projectFields
        );
        return {
          ...Object.fromEntries(
            workHistoryFields.map((field) => [field, historyData[field]])
          ),
          projects: {
            create: createProjects,
          },
        };
      });

    // LanguageSkill (ใหม่)
    const languageSkillFields = [
      "cvENLanguageSkillName",
      "cvENLanguageSkillProficiency",
    ];
    const { update: updateLanguageSkill, create: createLanguageSkill } =
      processEntries(languageSkills, "cvENLanguageSkillId", languageSkillFields);

    // อัปเดตลง DB
    const updatedCvEN = await prisma.cvEN.update({
      where: { cvENId: parseInt(cvENId, 10) },
      data: {
        ...cvENData,
        cvENUpdateAt: localNow,

        // Education
        CvENEducation: {
          update: updateEducation,
          create: createEducation,
        },
        // License
        CvENLicense: {
          update: updateLicense,
          create: createLicense,
        },
        // Work History
        CvENWorkHistory: {
          update: updateWorkHistories,
          create: createWorkHistories,
        },
        // Language Skill
        CvENLanguageSkill: {
          update: updateLanguageSkill,
          create: createLanguageSkill,
        },
      },
    });

    return NextResponse.json(
      { message: "CvEN data updated successfully", cvEN: updatedCvEN },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating cvEN data");
  }
}
