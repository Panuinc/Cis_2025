import { z } from "zod";

const preprocessInt = (emptyMessage, typeMessage) =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number({ invalid_type_error: typeMessage })).refine(val => !isNaN(val), { message: emptyMessage });

const educationSchema = z.object({
  cvEducationId: z.number().optional(),
  cvEducationDegree: z.string().nullable().optional(),
  cvEducationInstitution: z.string().nullable().optional(),
  cvEducationStartDate: z.preprocess((arg) => new Date(arg), z.date()),
  cvEducationEndDate: z.preprocess(
    (arg) => (arg ? new Date(arg) : null),
    z.date().nullable()
  ).optional(),
});

export function formatCvData(cvArray) {
  // สมมติว่าจัดรูปแบบเฉพาะสำหรับ cv data
  return cvArray.map(cv => ({
    ...cv,
    educations: cv.CvEducation,
    // licenses: cv.CvProfessionalLicense,
    // workHistories: cv.CvWorkHistory,
    // projects: cv.CvProject,
  }));
}

export const cvPutSchema = z.object({
  cvId: preprocessInt("Cv ID must be provided.", "Cv ID must be an integer."),
  cvEmployeeId: preprocessInt("Please Enter Cv Name", "Please Enter Cv Name"),
  cvUpdateBy: preprocessInt("Cv updater ID must be provided.", "Cv updater ID must be an integer."),
  educations: z.array(educationSchema).optional(),
  // เพิ่ม licenses, workHistories, projects schemas ตามต้องการ
});
