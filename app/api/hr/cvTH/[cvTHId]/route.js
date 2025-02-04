import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { cvTHPutSchema } from "@/app/api/hr/cvTH/cvTHSchema";
import { formatCvTHData } from "@/app/api/hr/cvTH/cvTHSchema";
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
    const cvTHId = parseInt(params.cvTHId, 10);

    if (!cvTHId) {
      return NextResponse.json({ error: "CvTH ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cvTH = await prisma.cvTH.findMany({
      where: { cvTHId: cvTHId },
      include: {
        CvTHEmployeeBy: true,
        CvTHEducation: true,
        CvTHLicense: true,
        CvTHWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvTHLanguageSkill: true,
        CvTHCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvTHUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!cvTH?.length) {
      return NextResponse.json({ error: "No cvTH data found" }, { status: 404 });
    }

    const formattedCvTH = cvTH.map((item) => {
      const {
        CvTHEducation,
        CvTHLicense,
        CvTHWorkHistory,
        CvTHLanguageSkill,
        CvTHEmployeeBy,
        ...rest
      } = item;

      const formattedEmployee = CvTHEmployeeBy
        ? {
            ...CvTHEmployeeBy,
            employeeBirthday: CvTHEmployeeBy.employeeBirthday
              ? CvTHEmployeeBy.employeeBirthday.toISOString().split("T")[0]
              : null,
          }
        : null;

      const formattedWorkHistories = CvTHWorkHistory.map((history) => {
        const { projects, ...historyRest } = history;
        return {
          ...historyRest,
          projects,
        };
      });

      return {
        ...rest,
        employee: formattedEmployee,
        educations: CvTHEducation,
        licenses: CvTHLicense,
        workHistories: formattedWorkHistories,
        languageSkills: CvTHLanguageSkill,
      };
    });

    return NextResponse.json(
      { message: "CvTH data retrieved successfully", cvTH: formattedCvTH },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving cvTH data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { cvTHId } = params;
    if (!cvTHId) {
      return NextResponse.json({ error: "CvTH ID is required" }, { status: 400 });
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

    const parsedData = cvTHPutSchema.parse({
      ...dataObj,
      cvTHId,
    });

    const { educations, licenses, workHistories, languageSkills, ...cvTHData } =
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
      "cvTHEducationDegree",
      "cvTHEducationInstitution",
      "cvTHEducationStartDate",
      "cvTHEducationEndDate",
    ];
    const { update: updateEducation, create: createEducation } = processEntries(
      educations,
      "cvTHEducationId",
      educationFields
    );

    // License
    const licenseFields = [
      "cvTHProfessionalLicenseName",
      "cvTHProfessionalLicenseNumber",
      "cvTHProfessionalLicenseStartDate",
      "cvTHProfessionalLicenseEndDate",
    ];
    const { update: updateLicense, create: createLicense } = processEntries(
      licenses,
      "cvTHProfessionalLicenseId",
      licenseFields
    );

    // WorkHistory (มี projects ข้างใน)
    const workHistoryFields = [
      "cvTHWorkHistoryCompanyName",
      "cvTHWorkHistoryPosition",
      "cvTHWorkHistoryStartDate",
      "cvTHWorkHistoryEndDate",
    ];
    const projectFields = ["cvTHProjectName", "cvTHProjectDescription"];

    const updateWorkHistories = (workHistories || [])
      .filter((e) => e.cvTHWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        // process projects
        const { update: updateProjects, create: createProjects } =
          processEntries(projects, "cvTHProjectId", projectFields);

        return {
          where: { cvTHWorkHistoryId: e.cvTHWorkHistoryId },
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
      .filter((e) => !e.cvTHWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        const { create: createProjects } = processEntries(
          projects,
          "cvTHProjectId",
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
      "cvTHLanguageSkillName",
      "cvTHLanguageSkillProficiency",
    ];
    const { update: updateLanguageSkill, create: createLanguageSkill } =
      processEntries(languageSkills, "cvTHLanguageSkillId", languageSkillFields);

    // อัปเดตลง DB
    const updatedCvTH = await prisma.cvTH.update({
      where: { cvTHId: parseInt(cvTHId, 10) },
      data: {
        ...cvTHData,
        cvTHUpdateAt: localNow,

        // Education
        CvTHEducation: {
          update: updateEducation,
          create: createEducation,
        },
        // License
        CvTHLicense: {
          update: updateLicense,
          create: createLicense,
        },
        // Work History
        CvTHWorkHistory: {
          update: updateWorkHistories,
          create: createWorkHistories,
        },
        // Language Skill
        CvTHLanguageSkill: {
          update: updateLanguageSkill,
          create: createLanguageSkill,
        },
      },
    });

    return NextResponse.json(
      { message: "CvTH data updated successfully", cvTH: updatedCvTH },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating cvTH data");
  }
}
