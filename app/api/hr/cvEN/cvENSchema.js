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
  cvENEducationId: preprocessInt(
    "CvENEducation ID must be provided.",
    "CvENEducation ID must be an integer."
  ).optional(),

  cvENEducationCvENId: preprocessInt(
    "CvENEducation CvEN ID must be provided.",
    "CvENEducation CvEN ID must be an integer."
  ).optional(),

  cvENEducationDegree: preprocessString(
    "Please Enter Degree",
    "Please Enter Degree"
  ),

  cvENEducationInstitution: preprocessString(
    "Please Enter Institution",
    "Please Enter Institution"
  ),

  cvENEducationStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvENEducationEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const licenseSchema = z.object({
  cvENProfessionalLicenseId: preprocessInt(
    "CvEN ProfessionalLicense ID must be provided.",
    "CvEN ProfessionalLicense ID must be an integer."
  ).optional(),

  cvENProfessionalLicenseCvENId: preprocessInt(
    "CvEN ProfessionalLicense CvEN ID must be provided.",
    "CvEN ProfessionalLicense CvEN ID must be an integer."
  ).optional(),

  cvENProfessionalLicenseName: preprocessString(
    "Please Enter ProfessionalLicense Name",
    "Please Enter ProfessionalLicense Name"
  ),

  cvENProfessionalLicenseNumber: preprocessString(
    "Please Enter ProfessionalLicense Number",
    "Please Enter ProfessionalLicense Number"
  ),

  cvENProfessionalLicenseStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvENProfessionalLicenseEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const projectSchema = z.object({
  cvENProjectId: preprocessInt(
    "CvENProject ID must be provided.",
    "CvENProject ID must be an integer."
  ).optional(),

  cvENProjectWorkHistoryId: preprocessInt(
    "CvENProject Work History ID must be provided.",
    "CvENProject Work History ID must be an integer."
  ).optional(),

  cvENProjectName: preprocessString(
    "Please Enter Project Name",
    "Please Enter Project Name"
  ),

  cvENProjectDescription: preprocessString(
    "Please Enter Project Description",
    "Please Enter Project Description"
  ),
});

const workHistorySchema = z.object({
  cvENWorkHistoryId: preprocessInt(
    "CvENWorkHistory ID must be provided.",
    "CvENWorkHistory ID must be an integer."
  ).optional(),

  cvENWorkHistoryCvENId: preprocessInt(
    "CvENWorkHistory CvEN ID must be provided.",
    "CvENWorkHistory CvEN ID must be an integer."
  ).optional(),

  cvENWorkHistoryCompanyName: preprocessString(
    "Please Enter Company Name",
    "Please Enter Company Name"
  ),

  cvENWorkHistoryPosition: preprocessString(
    "Please Enter Position",
    "Please Enter Position"
  ),

  cvENWorkHistoryStartDate: preprocessString(
    "Please Enter Start Date",
    "Please Enter Start Date"
  ),

  cvENWorkHistoryEndDate: preprocessString(
    "Please Enter End Date",
    "Please Enter End Date"
  ),

  projects: z.array(projectSchema).optional(),
});

const languageSkillSchema = z.object({
  cvENLanguageSkillId: preprocessInt(
    "CvENLanguageSkill ID must be provided.",
    "CvENLanguageSkill ID must be an integer."
  ).optional(),

  cvENLanguageSkillCvENId: preprocessInt(
    "CvENLanguageSkill CvEN ID must be provided.",
    "CvENLanguageSkill CvEN ID must be an integer."
  ).optional(),

  cvENLanguageSkillName: preprocessString(
    "Please Enter Language Skill Name",
    "Please Enter Language Skill Name"
  ),

  cvENLanguageSkillProficiency: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Language Skill Proficiency is required",
    invalid_type_error:
      "Language Skill Proficiency must be 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'",
  }),
});

export function formatCvENData(cvENArray) {
  return cvENArray.map((cvEN) => ({
    ...cvEN,
    educations: cvEN.CvENEducation,
    licenses: cvEN.CvENProfessionalLicense,
  }));
}

export const cvENPutSchema = z.object({
  cvENId: preprocessInt("CvEN ID must be provided.", "CvEN ID must be an integer."),

  cvENEmployeeId: preprocessInt(
    "Employee ID must be provided.",
    "Employee ID must be an integer."
  ).optional(),

  cvENUpdateBy: preprocessInt(
    "CvEN updater ID must be provided.",
    "CvEN updater ID must be an integer."
  ),

  educations: z.array(educationSchema).optional(),
  licenses: z.array(licenseSchema).optional(),
  workHistories: z.array(workHistorySchema).optional(),
  languageSkills: z.array(languageSkillSchema).optional(),
});
