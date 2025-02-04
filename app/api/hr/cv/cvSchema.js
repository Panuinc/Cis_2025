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
  cvEducationId: preprocessInt(
    "CvEducation ID must be provided.",
    "CvEducation ID must be an integer."
  ).optional(),

  cvEducationCvId: preprocessInt(
    "CvEducation CV ID must be provided.",
    "CvEducation Cv ID must be an integer."
  ).optional(),

  cvEducationDegree: preprocessString(
    "Please Enter Degree",
    "Please Enter Degree"
  ),

  cvEducationInstitution: preprocessString(
    "Please Enter Institution",
    "Please Enter Institution"
  ),

  cvEducationStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvEducationEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const licenseSchema = z.object({
  cvProfessionalLicenseId: preprocessInt(
    "Cv ProfessionalLicense ID must be provided.",
    "Cv ProfessionalLicense ID must be an integer."
  ).optional(),

  cvProfessionalLicenseCvId: preprocessInt(
    "Cv ProfessionalLicense Cv ID must be provided.",
    "Cv ProfessionalLicense Cv ID must be an integer."
  ).optional(),

  cvProfessionalLicenseName: preprocessString(
    "Please Enter ProfessionalLicense Name",
    "Please Enter ProfessionalLicense Name"
  ),

  cvProfessionalLicenseNumber: preprocessString(
    "Please Enter ProfessionalLicense Number",
    "Please Enter ProfessionalLicense Number"
  ),

  cvProfessionalLicenseStartDate: preprocessString(
    "Please Enter Start date",
    "Please Enter Start date"
  ),

  cvProfessionalLicenseEndDate: preprocessString(
    "Please Enter End date",
    "Please Enter End date"
  ),
});

const projectSchema = z.object({
  cvProjectId: preprocessInt(
    "CvProject ID must be provided.",
    "CvProject ID must be an integer."
  ).optional(),

  cvProjectWorkHistoryId: preprocessInt(
    "CvProject Work History ID must be provided.",
    "CvProject Work History ID must be an integer."
  ).optional(),

  cvProjectName: preprocessString(
    "Please Enter Project Name",
    "Please Enter Project Name"
  ),

  cvProjectDescription: preprocessString(
    "Please Enter Project Description",
    "Please Enter Project Description"
  ),
});

const workHistorySchema = z.object({
  cvWorkHistoryId: preprocessInt(
    "CvWorkHistory ID must be provided.",
    "CvWorkHistory ID must be an integer."
  ).optional(),

  cvWorkHistoryCvId: preprocessInt(
    "CvWorkHistory Cv ID must be provided.",
    "CvWorkHistory Cv ID must be an integer."
  ).optional(),

  cvWorkHistoryCompanyName: preprocessString(
    "Please Enter Company Name",
    "Please Enter Company Name"
  ),

  cvWorkHistoryPosition: preprocessString(
    "Please Enter Position",
    "Please Enter Position"
  ),

  cvWorkHistoryStartDate: preprocessString(
    "Please Enter Start Date",
    "Please Enter Start Date"
  ),

  cvWorkHistoryEndDate: preprocessString(
    "Please Enter End Date",
    "Please Enter End Date"
  ),

  projects: z.array(projectSchema).optional(),
});

const languageSkillSchema = z.object({
  cvLanguageSkillId: preprocessInt(
    "CvLanguageSkill ID must be provided.",
    "CvLanguageSkill ID must be an integer."
  ).optional(),

  cvLanguageSkillCvId: preprocessInt(
    "CvLanguageSkill Cv ID must be provided.",
    "CvLanguageSkill Cv ID must be an integer."
  ).optional(),

  cvLanguageSkillName: preprocessString(
    "Please Enter Language Skill Name",
    "Please Enter Language Skill Name"
  ),

  cvLanguageSkillProficiency: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Language Skill Proficiency is required",
    invalid_type_error:
      "Language Skill Proficiency must be 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'",
  }),
});

export function formatCvData(cvArray) {
  return cvArray.map((cv) => ({
    ...cv,
    educations: cv.CvEducation,
    licenses: cv.CvProfessionalLicense,
  }));
}

export const cvPutSchema = z.object({
  cvId: preprocessInt("Cv ID must be provided.", "Cv ID must be an integer."),

  cvEmployeeId: preprocessInt(
    "Employee ID must be provided.",
    "Employee ID must be an integer."
  ).optional(),

  cvUpdateBy: preprocessInt(
    "Cv updater ID must be provided.",
    "Cv updater ID must be an integer."
  ),

  educations: z.array(educationSchema).optional(),
  licenses: z.array(licenseSchema).optional(),
  workHistories: z.array(workHistorySchema).optional(),
  languageSkills: z.array(languageSkillSchema).optional(),
});
