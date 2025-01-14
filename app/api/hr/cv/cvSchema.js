import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

// export function formatCvData(cv) {
//   return formatData(cv, [], ["cvUpdateAt", "cvUpdateAt"]);
// }

const educationSchema = z.object({
  cvEducationId: preprocessInt(
    "Cv ID must be provided.",
    "Cv ID must be an integer."
  ).optional(),

  cvEducationCvId: preprocessInt(
    "CvEducation ID must be provided.",
    "CvEducation ID must be an integer."
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

export function formatCvData(cvArray) {
  return cvArray.map((cv) => ({
    ...cv,
    educations: cv.CvEducation,
    // licenses: cv.CvProfessionalLicense,
    // workHistories: cv.CvWorkHistory,
    // projects: cv.CvProject,
  }));
}

export const cvPutSchema = z.object({
  cvId: preprocessInt("Cv ID must be provided.", "Cv ID must be an integer."),

  cvEmployeeId: preprocessInt(
    "Employee ID must be provided.",
    "Employee ID must be an integer."
  ),

  cvUpdateBy: preprocessInt(
    "Cv updater ID must be provided.",
    "Cv updater ID must be an integer."
  ),

  educations: z.array(educationSchema).optional(),
  // เพิ่ม licenses, workHistories, projects schemas ตามต้องการ
});
