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
  ),
  employmentNumber: z
    .string({ required_error: "Please Enter Employment Number" })
    .min(1, { message: "Please Enter Employment Number" }),
  employmentCardNumber: z
    .string({ required_error: "Please Enter Employment Card Number" })
    .min(1, { message: "Please Enter Employment Card Number" }),
  employmentType: z.enum(["DAILY_WAGE", "MONTHLY_SALARY", "Mrs"], {
    required_error:
      "Employment Title must be either 'DAILY_WAGE' or 'MONTHLY_SALARY' or 'MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES'.",
    invalid_type_error:
      "Employment Title must be either 'DAILY_WAGE' or 'MONTHLY_SALARY' or 'MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES'.",
  }),

  employmentBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  employmentSiteId: preprocessInt(
    "Site ID must be provided.",
    "Site ID must be an integer."
  ),
  employmentDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),
  employmentDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),
  employmentPositionId: preprocessInt(
    "Position ID must be provided.",
    "Position ID must be an integer."
  ),

  employmentRoleId: preprocessInt(
    "Role ID must be provided.",
    "PosiRoletion ID must be an integer."
  ),
  employmentParentId: preprocessInt(
    "Parent ID must be provided.",
    "Parent ID must be an integer."
  ),
  employmentStartWork: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Birthday must be a valid date and not in the future" }
  ),
  employmentPicture: z.any().nullable().optional(),
  employmentSignature: z.any().nullable().optional(),

  employmentEnterType: z
    .string({ required_error: "Please Enter Type Enter" })
    .min(1, { message: "Please Enter Type Enter" }),
  employmentPassportNumber: z
    .string({ required_error: "Please Enter Passport Number" })
    .min(1, { message: "Please Enter Passport Number" }),
  employmentPassportStartDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Passport Start must be a valid date and not in the future" }
  ),
  employmentPassportEndDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Passport End must be a valid date and not in the future" }
  ),
  employmentPassportIssuedBy: z
    .string({ required_error: "Please Enter Issued By" })
    .min(1, { message: "Please Enter Issued By" }),

  employmentPlaceOfBirth: z
    .string({ required_error: "Please Enter Place Of Birth" })
    .min(1, { message: "Please Enter Place Of Birth" }),
  employmentEnterCheckPoint: z
    .string({ required_error: "Please Enter Check Point" })
    .min(1, { message: "Please Enter Check Point" }),
  employmentEnterDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Enter Date must be a valid date and not in the future" }
  ),
  employmentImmigration: z
    .string({ required_error: "Please Enter Immigration" })
    .min(1, { message: "Please Enter Immigration" }),
  employmentTypeOfVisa: z
    .string({ required_error: "Please Enter Type Of Visa" })
    .min(1, { message: "Please Enter Type Of Visa" }),

  employmentVisaNumber: z
    .string({ required_error: "Please Enter Visa Number" })
    .min(1, { message: "Please Enter Visa Number" }),
  employmentVisaIssuedBy: z
    .string({ required_error: "Please Enter Visa Issued By" })
    .min(1, { message: "Please Enter Visa Issued By" }),
  employmentWorkPermitNumber: z
    .string({ required_error: "Please Enter Work Permit Number" })
    .min(1, { message: "Please Enter Work Permit Number" }),
  employmentWorkPermitStartDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Work Permit Start must be a valid date and not in the future" }
  ),
  employmentWorkPermitEndDate: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Work Permit End must be a valid date and not in the future" }
  ),

  employmentWorkPermitIssuedBy: z
    .string({ required_error: "Please Enter Work Permit Issued By" })
    .min(1, { message: "Please Enter Work Permit Issued By" }),
  employmentSsoNumber: z
    .string({ required_error: "Please Enter Sso Number" })
    .min(1, { message: "Please Enter Sso Number" }),
  employmentSsoHospital: z
    .string({ required_error: "Please Enter Sso Hospital" })
    .min(1, { message: "Please Enter Sso Hospital" }),
  employmentWorkStatus: z.enum(["CurrentEmployee", "Resign"], {
    required_error:
      "Employment Title must be either 'CurrentEmployee' or 'Resign'.",
    invalid_type_error:
      "Employment Title must be either 'CurrentEmployee' or 'Resign'.",
  }),
  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  ),
});
