import { z } from "zod";

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().replace("T", " ").slice(0, 19);
};

const formatDateWithoutTime = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().split("T")[0];
};

const preprocessInt = (requiredMsg, intMsg) =>
  z.preprocess(
    (val) => parseInt(val, 10),
    z.number({ required_error: requiredMsg }).int({ message: intMsg })
  );

const preprocessDate = z.preprocess((val) => {
  if (!val) return null;
  if (typeof val === "string" || val instanceof Date) {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}, z.date().nullable().optional());

export function formatEmploymentData(employment) {
  return employment.map((employment) => ({
    ...employment,
    employmentStartWork: formatDateWithoutTime(employment.employmentStartWork),
    employmentPassportStartDate: formatDateWithoutTime(
      employment.employmentPassportStartDate
    ),
    employmentPassportEndDate: formatDateWithoutTime(
      employment.employmentPassportEndDate
    ),
    employmentEnterDate: formatDateWithoutTime(employment.employmentEnterDate),
    employmentWorkPermitStartDate: formatDateWithoutTime(
      employment.employmentWorkPermitStartDate
    ),
    employmentWorkPermitEndDate: formatDateWithoutTime(
      employment.employmentWorkPermitEndDate
    ),
    employmentCreateAt: formatDate(employment.employmentCreateAt),
    employmentUpdateAt: formatDate(employment.employmentUpdateAt),
  }));
}

export const employmentPutSchema = z.object({
  employmentId: preprocessInt(
    "Employment ID must be provided.",
    "Employment ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentNumber: z
    .string({ required_error: "Please Enter Employment Number" })
    .min(1, { message: "Please Enter Employment Number" })
    .nullable()
    .optional(),

  employmentCardNumber: z
    .string({ required_error: "Please Enter Employment Card Number" })
    .min(1, { message: "Please Enter Employment Card Number" })
    .nullable()
    .optional(),

  employmentType: z
    .enum(["DAILY_WAGE", "MONTHLY_SALARY", "Mrs"], {
      required_error:
        "Employment Title must be either 'DAILY_WAGE', 'MONTHLY_SALARY', or 'Mrs'.",
    })
    .nullable()
    .optional(),

  employmentBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentSiteId: preprocessInt(
    "Site ID must be provided.",
    "Site ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentPositionId: preprocessInt(
    "Position ID must be provided.",
    "Position ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentRoleId: preprocessInt(
    "Role ID must be provided.",
    "Role ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentParentId: preprocessInt(
    "Parent ID must be provided.",
    "Parent ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentStartWork: preprocessDate,

  employmentPicture: z.any().nullable().optional(),
  employmentSignature: z.any().nullable().optional(),

  employmentEnterType: z
    .string({ required_error: "Please Enter Type Enter" })
    .min(1, { message: "Please Enter Type Enter" })
    .nullable()
    .optional(),

  employmentPassportNumber: z
    .string({ required_error: "Please Enter Passport Number" })
    .min(1, { message: "Please Enter Passport Number" })
    .nullable()
    .optional(),

  employmentPassportStartDate: preprocessDate,
  employmentPassportEndDate: preprocessDate,
  employmentEnterDate: preprocessDate,
  employmentWorkPermitStartDate: preprocessDate,
  employmentWorkPermitEndDate: preprocessDate,

  employmentPassportIssuedBy: z
    .string({ required_error: "Please Enter Issued By" })
    .min(1, { message: "Please Enter Issued By" })
    .nullable()
    .optional(),

  employmentPlaceOfBirth: z
    .string({ required_error: "Please Enter Place Of Birth" })
    .min(1, { message: "Please Enter Place Of Birth" })
    .nullable()
    .optional(),

  employmentEnterCheckPoint: z
    .string({ required_error: "Please Enter Check Point" })
    .min(1, { message: "Please Enter Check Point" })
    .nullable()
    .optional(),

  employmentImmigration: z
    .string({ required_error: "Please Enter Immigration" })
    .min(1, { message: "Please Enter Immigration" })
    .nullable()
    .optional(),

  employmentTypeOfVisa: z
    .string({ required_error: "Please Enter Type Of Visa" })
    .min(1, { message: "Please Enter Type Of Visa" })
    .nullable()
    .optional(),

  employmentVisaNumber: z
    .string({ required_error: "Please Enter Visa Number" })
    .min(1, { message: "Please Enter Visa Number" })
    .nullable()
    .optional(),

  employmentVisaIssuedBy: z
    .string({ required_error: "Please Enter Visa Issued By" })
    .min(1, { message: "Please Enter Visa Issued By" })
    .nullable()
    .optional(),

  employmentWorkPermitNumber: z
    .string({ required_error: "Please Enter Work Permit Number" })
    .min(1, { message: "Please Enter Work Permit Number" })
    .nullable()
    .optional(),

  employmentWorkPermitIssuedBy: z
    .string({ required_error: "Please Enter Work Permit Issued By" })
    .min(1, { message: "Please Enter Work Permit Issued By" })
    .nullable()
    .optional(),

  employmentSsoNumber: z
    .string({ required_error: "Please Enter Sso Number" })
    .min(1, { message: "Please Enter Sso Number" })
    .nullable()
    .optional(),

  employmentSsoHospital: z
    .string({ required_error: "Please Enter Sso Hospital" })
    .min(1, { message: "Please Enter Sso Hospital" })
    .nullable()
    .optional(),

  employmentWorkStatus: z
    .enum(["CurrentEmployee", "Resign"], {
      required_error:
        "Employment Status must be either 'CurrentEmployee' or 'Resign'.",
    })
    .nullable()
    .optional(),

  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  )
    .nullable()
    .optional(),
});
