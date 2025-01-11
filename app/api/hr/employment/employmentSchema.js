import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatEmploymentData(employment) {
  return formatData(
    employment,
    [
      "employmentStartWork",
      "employmentPassportStartDate",
      "employmentPassportEndDate",
      "employmentEnterDate",
      "employmentWorkPermitStartDate",
      "employmentWorkPermitEndDate",
    ],
    ["employmentCreateAt", "employmentUpdateAt"]
  );
}

export const employmentPutSchema = z.object({
  employmentId: preprocessInt(
    "Employment ID must be provided.",
    "Employment ID must be an integer."
  )
    .nullable()
    .optional(),

  employmentNumber: preprocessString(
    "Please Enter Employment Number",
    "Please Enter Employment Number"
  )
    .nullable()
    .optional(),

  employmentCardNumber: preprocessString(
    "Please Enter Employment Card Number",
    "Please Enter Employment Card Number"
  )
    .nullable()
    .optional(),

  employmentType: preprocessEnum(
    ["Mr", "Ms", "Mrs"],
    "Employment Title must be either 'Mr', 'Ms', or 'Mrs'."
  )
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

  employmentPicture: preprocessAny({
    url: z.string(),
    description: z.string().optional().nullable(),
  }),

  employmentSignature: preprocessAny({
    url: z.string(),
    description: z.string().optional().nullable(),
  }),

  employmentEnterType: preprocessString(
    "Please Enter Employment Enter Type",
    "Please Enter Employment Enter Type"
  )
    .nullable()
    .optional(),

  employmentPassportNumber: preprocessString(
    "Please Enter Employment Passport Number",
    "Please Enter Employment Passport Number"
  )
    .nullable()
    .optional(),

  employmentPassportStartDate: preprocessDate,

  employmentPassportEndDate: preprocessDate,

  employmentEnterDate: preprocessDate,

  employmentWorkPermitStartDate: preprocessDate,

  employmentWorkPermitEndDate: preprocessDate,

  employmentPassportIssuedBy: preprocessString(
    "Please Enter Employment Issued By",
    "Please Enter Employment Issued By"
  )
    .nullable()
    .optional(),

  employmentPlaceOfBirth: preprocessString(
    "Please Enter Employment Place Of Birth",
    "Please Enter Employment Place Of Birth"
  )
    .nullable()
    .optional(),

  employmentEnterCheckPoint: preprocessString(
    "Please Enter Employment Check Point",
    "Please Enter Employment Check Point"
  )
    .nullable()
    .optional(),

  employmentImmigration: preprocessString(
    "Please Enter Employment Immigration",
    "Please Enter Employment Immigration"
  )
    .nullable()
    .optional(),

  employmentTypeOfVisa: preprocessString(
    "Please Enter Employment Type Of Visa",
    "Please Enter Employment Type Of Visa"
  )
    .nullable()
    .optional(),

  employmentVisaNumber: preprocessString(
    "Please Enter Employment Visa Number",
    "Please Enter Employment Visa Number"
  )
    .nullable()
    .optional(),

  employmentVisaIssuedBy: preprocessString(
    "Please Enter Employment Visa Issued By",
    "Please Enter Employment Visa Issued By"
  )
    .nullable()
    .optional(),

  employmentWorkPermitNumber: preprocessString(
    "Please Enter Employment Work Permit Number",
    "Please Enter Employment Work Permit Number"
  )
    .nullable()
    .optional(),

  employmentWorkPermitIssuedBy: preprocessString(
    "Please Enter Employment Work Permit Issued By",
    "Please Enter Employment Work Permit Issued By"
  )
    .nullable()
    .optional(),

  employmentSsoNumber: preprocessString(
    "Please Enter Employment Sso Number",
    "Please Enter Employment Sso Number"
  )
    .nullable()
    .optional(),

  employmentSsoHospital: preprocessString(
    "Please Enter Employment Sso Hospital",
    "Please Enter Employment Sso Hospital"
  )
    .nullable()
    .optional(),

  employmentWorkStatus: preprocessEnum(
    ["CurrentEmployee", "Resign"],
    "Employment Status must be either 'CurrentEmployee', 'Resign'."
  )
    .nullable()
    .optional(),

  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  )
    .nullable()
    .optional(),
});
