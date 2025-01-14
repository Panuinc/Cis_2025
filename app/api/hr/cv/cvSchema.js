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

export function formatCvData(cvArray) {
  return cvArray.map((cv) => ({
    ...cv,
    educations: cv.CvEducation,
    licenses: cv.CvProfessionalLicense,
    // workHistories: cv.CvWorkHistory,
    // projects: cv.CvProject,
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

  // เพิ่ม licenses, workHistories, projects schemas ตามต้องการ
});
