import { NextResponse } from "next/server";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { cvPutSchema } from "@/app/api/hr/cv/cvSchema";
import { formatCvData } from "@/app/api/hr/cv/cvSchema";
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
    const cvId = parseInt(params.cvId, 10);

    if (!cvId) {
      return NextResponse.json({ error: "Cv ID is required" }, { status: 400 });
    }

    verifySecretToken(request.headers);
    await checkRateLimit(ip);

    const cv = await prisma.cv.findMany({
      where: { cvId: cvId },
      include: {
        CvEmployeeBy: true,
        CvEducation: true,
        CvLicense: true,
        CvWorkHistory: {
          include: {
            projects: true,
          },
        },
        CvLanguageSkill: true,
        CvCreateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
        CvUpdateBy: {
          select: { employeeFirstname: true, employeeLastname: true },
        },
      },
    });

    if (!cv?.length) {
      return NextResponse.json({ error: "No cv data found" }, { status: 404 });
    }

    const formattedCv = cv.map((item) => {
      const {
        CvEducation,
        CvLicense,
        CvWorkHistory,
        CvLanguageSkill,
        CvEmployeeBy,
        ...rest
      } = item;

      const formattedEmployee = CvEmployeeBy
        ? {
            ...CvEmployeeBy,
            employeeBirthday: CvEmployeeBy.employeeBirthday
              ? CvEmployeeBy.employeeBirthday.toISOString().split("T")[0]
              : null,
          }
        : null;

      const formattedWorkHistories = CvWorkHistory.map((history) => {
        const { projects, ...historyRest } = history;
        return {
          ...historyRest,
          projects,
        };
      });

      return {
        ...rest,
        employee: formattedEmployee,
        educations: CvEducation,
        licenses: CvLicense,
        workHistories: formattedWorkHistories,
        languageSkills: CvLanguageSkill,
      };
    });

    return NextResponse.json(
      { message: "Cv data retrieved successfully", cv: formattedCv },
      { status: 200 }
    );
  } catch (error) {
    return handleGetErrors(error, ip, "Error retrieving cv data");
  }
}

export async function PUT(request, context) {
  let ip;
  try {
    ip = getRequestIP(request);

    const params = await context.params;
    const { cvId } = params;
    if (!cvId) {
      return NextResponse.json({ error: "Cv ID is required" }, { status: 400 });
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

    const parsedData = cvPutSchema.parse({
      ...dataObj,
      cvId,
    });

    const { educations, licenses, workHistories, languageSkills, ...cvData } =
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
      "cvEducationDegree",
      "cvEducationInstitution",
      "cvEducationStartDate",
      "cvEducationEndDate",
    ];
    const { update: updateEducation, create: createEducation } = processEntries(
      educations,
      "cvEducationId",
      educationFields
    );

    // License
    const licenseFields = [
      "cvProfessionalLicenseName",
      "cvProfessionalLicenseNumber",
      "cvProfessionalLicenseStartDate",
      "cvProfessionalLicenseEndDate",
    ];
    const { update: updateLicense, create: createLicense } = processEntries(
      licenses,
      "cvProfessionalLicenseId",
      licenseFields
    );

    // WorkHistory (มี projects ข้างใน)
    const workHistoryFields = [
      "cvWorkHistoryCompanyName",
      "cvWorkHistoryPosition",
      "cvWorkHistoryStartDate",
      "cvWorkHistoryEndDate",
    ];
    const projectFields = ["cvProjectName", "cvProjectDescription"];

    const updateWorkHistories = (workHistories || [])
      .filter((e) => e.cvWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        // process projects
        const { update: updateProjects, create: createProjects } =
          processEntries(projects, "cvProjectId", projectFields);

        return {
          where: { cvWorkHistoryId: e.cvWorkHistoryId },
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
      .filter((e) => !e.cvWorkHistoryId)
      .map((e) => {
        const { projects, ...historyData } = e;
        const { create: createProjects } = processEntries(
          projects,
          "cvProjectId",
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
      "cvLanguageSkillName",
      "cvLanguageSkillProficiency",
    ];
    const { update: updateLanguageSkill, create: createLanguageSkill } =
      processEntries(languageSkills, "cvLanguageSkillId", languageSkillFields);

    // อัปเดตลง DB
    const updatedCv = await prisma.cv.update({
      where: { cvId: parseInt(cvId, 10) },
      data: {
        ...cvData,
        cvUpdateAt: localNow,

        // Education
        CvEducation: {
          update: updateEducation,
          create: createEducation,
        },
        // License
        CvLicense: {
          update: updateLicense,
          create: createLicense,
        },
        // Work History
        CvWorkHistory: {
          update: updateWorkHistories,
          create: createWorkHistories,
        },
        // Language Skill
        CvLanguageSkill: {
          update: updateLanguageSkill,
          create: createLanguageSkill,
        },
      },
    });

    return NextResponse.json(
      { message: "Cv data updated successfully", cv: updatedCv },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Error updating cv data");
  }
}
