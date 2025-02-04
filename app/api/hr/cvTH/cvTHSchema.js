import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

const educationSchema = z.object({
  cvTHEducationId: preprocessInt(
    "CvTHEducation ID must be provided.",
    "CvTHEducation ID must be an integer."
  ).optional(),

  cvTHEducationCvTHId: preprocessInt(
    "CvTHEducation CVTH ID must be provided.",
    "CvTHEducation CvTH ID must be an integer."
  ).optional(),

  cvTHEducationDegree: preprocessString(
    "Please Enter Degree",
    "Please Enter Degree"
  ),

  cvTHEducationInstitution: preprocessString(
    "Please Enter Institution",
    "Please Enter Institution"
  ),

  cvTHEducationStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvTHEducationEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const licenseSchema = z.object({
  cvTHProfessionalLicenseId: preprocessInt(
    "CvTH ProfessionalLicense ID must be provided.",
    "CvTH ProfessionalLicense ID must be an integer."
  ).optional(),

  cvTHProfessionalLicenseCvTHId: preprocessInt(
    "CvTH ProfessionalLicense CvTH ID must be provided.",
    "CvTH ProfessionalLicense CvTH ID must be an integer."
  ).optional(),

  cvTHProfessionalLicenseName: preprocessString(
    "Please Enter ProfessionalLicense Name",
    "Please Enter ProfessionalLicense Name"
  ),

  cvTHProfessionalLicenseNumber: preprocessString(
    "Please Enter ProfessionalLicense Number",
    "Please Enter ProfessionalLicense Number"
  ),

  cvTHProfessionalLicenseStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvTHProfessionalLicenseEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const projectSchema = z.object({
  cvTHProjectId: preprocessInt(
    "CvTHProject ID must be provided.",
    "CvTHProject ID must be an integer."
  ).optional(),

  cvTHProjectWorkHistoryId: preprocessInt(
    "CvTHProject Work History ID must be provided.",
    "CvTHProject Work History ID must be an integer."
  ).optional(),

  cvTHProjectName: preprocessString(
    "Please Enter Project Name",
    "Please Enter Project Name"
  ),

  cvTHProjectDescription: preprocessString(
    "Please Enter Project Description",
    "Please Enter Project Description"
  ),
});

const workHistorySchema = z.object({
  cvTHWorkHistoryId: preprocessInt(
    "CvTHWorkHistory ID must be provided.",
    "CvTHWorkHistory ID must be an integer."
  ).optional(),

  cvTHWorkHistoryCvTHId: preprocessInt(
    "CvTHWorkHistory CvTH ID must be provided.",
    "CvTHWorkHistory CvTH ID must be an integer."
  ).optional(),

  cvTHWorkHistoryCompanyName: preprocessString(
    "Please Enter Company Name",
    "Please Enter Company Name"
  ),

  cvTHWorkHistoryPosition: preprocessString(
    "Please Enter Position",
    "Please Enter Position"
  ),

  cvTHWorkHistoryStartDate: preprocessString(
    "Please Enter Start Date",
    "Please Enter Start Date"
  ),

  cvTHWorkHistoryEndDate: preprocessString(
    "Please Enter End Date",
    "Please Enter End Date"
  ),

  projects: z.array(projectSchema).optional(),
});

const languageSkillSchema = z.object({
  cvTHLanguageSkillId: preprocessInt(
    "CvTHLanguageSkill ID must be provided.",
    "CvTHLanguageSkill ID must be an integer."
  ).optional(),

  cvTHLanguageSkillCvTHId: preprocessInt(
    "CvTHLanguageSkill CvTH ID must be provided.",
    "CvTHLanguageSkill CvTH ID must be an integer."
  ).optional(),

  cvTHLanguageSkillName: preprocessString(
    "Please Enter Language Skill Name",
    "Please Enter Language Skill Name"
  ),

  cvTHLanguageSkillProficiency: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Language Skill Proficiency is required",
    invalid_type_error:
      "Language Skill Proficiency must be 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'",
  }),
});

export function formatCvTHData(cvTHArray) {
  return cvTHArray.map((cvTH) => ({
    ...cvTH,
    educations: cvTH.CvTHEducation,
    licenses: cvTH.CvTHProfessionalLicense,
  }));
}

export const cvTHPutSchema = z.object({
  cvTHId: preprocessInt("CvTH ID must be provided.", "CvTH ID must be an integer."),

  cvTHEmployeeId: preprocessInt(
    "Employee ID must be provided.",
    "Employee ID must be an integer."
  ).optional(),

  cvTHUpdateBy: preprocessInt(
    "CvTH updater ID must be provided.",
    "CvTH updater ID must be an integer."
  ),

  educations: z.array(educationSchema).optional(),
  licenses: z.array(licenseSchema).optional(),
  workHistories: z.array(workHistorySchema).optional(),
  languageSkills: z.array(languageSkillSchema).optional(),
});
