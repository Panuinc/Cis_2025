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
  ),

  employmentNumber: preprocessString(
    "Please Enter Employment Number",
    "Please Enter Employment Number"
  ),

  employmentCardNumber: preprocessString(
    "Please Enter Employment Card Number",
    "Please Enter Employment Card Number"
  ),

  employmentType: preprocessEnum(
    [
      "รายเดือน",
      "รายวัน",
      "รายเดือน(พิการ)",
    ],
    "Employment Title must be either 'รายเดือน', 'รายวัน', or 'รายเดือน(พิการ)'."
  ),

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
    "Role ID must be an integer."
  ),

  employmentParentId: preprocessInt(
    "Parent ID must be provided.",
    "Parent ID must be an integer."
  ),

  employmentStartWork: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Start Work Date",
    }
  ),

  employmentPicture: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  employmentSignature: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  employmentWorkStatus: preprocessEnum(
    ["พนักงาน", "ลาออก"],
    "Employment Status must be either 'พนักงาน', 'ลาออก'."
  ),

  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  ),
});

export const employmentPatchSchema = z.object({
  employmentId: preprocessInt(
    "Employment ID must be provided.",
    "Employment ID must be an integer."
  ),

  employmentNumber: preprocessString(
    "Please Enter Employment Number",
    "Please Enter Employment Number"
  ),

  employmentCardNumber: preprocessString(
    "Please Enter Employment Card Number",
    "Please Enter Employment Card Number"
  ),

  employmentType: preprocessEnum(
    [
      "รายเดือน",
      "รายวัน",
      "รายเดือน(พิการ)",
    ],
    "Employment Title must be either 'รายเดือน', 'รายวัน', or 'รายเดือน(พิการ)'."
  ),

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
    "Role ID must be an integer."
  ),

  employmentParentId: preprocessInt(
    "Parent ID must be provided.",
    "Parent ID must be an integer."
  ),

  employmentStartWork: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Start Work Date",
    }
  ),

  employmentPicture: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  employmentSignature: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  employmentEnterType: preprocessString(
    "Please Enter Employment Enter Type",
    "Please Enter Employment Enter Type"
  ),

  employmentPassportNumber: preprocessString(
    "Please Enter Passport Number",
    "Please Enter Passport Number"
  ),

  employmentPassportStartDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Passport Start Date",
    }
  ),

  employmentPassportEndDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Passport End Date",
    }
  ),

  employmentEnterDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Employment Enter Date",
    }
  ),

  employmentWorkPermitStartDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Work Permit Start Date",
    }
  ),

  employmentWorkPermitEndDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Work Permit End Date",
    }
  ),

  employmentPassportIssuedBy: preprocessString(
    "Please Enter Passport Issued By",
    "Please Enter Passport Issued By"
  ),

  employmentPlaceOfBirth: preprocessString(
    "Please Enter Places Of Birth",
    "Please Enter Places Of Birth"
  ),

  employmentEnterCheckPoint: preprocessString(
    "Please Enter Employment Enter Check Point",
    "Please Enter Employment Enter Check Point"
  ),

  employmentImmigration: preprocessString(
    "Please Enter Immigration",
    "Please Enter Immigration"
  ),

  employmentTypeOfVisa: preprocessString(
    "Please Enter Type Of Visa",
    "Please Enter Type Of Visa"
  ),

  employmentVisaNumber: preprocessString(
    "Please Enter Visa Number",
    "Please Enter Visa Number"
  ),

  employmentVisaIssuedBy: preprocessString(
    "Please Enter Visa Issue By",
    "Please Enter Visa Issue By"
  ),

  employmentWorkPermitNumber: preprocessString(
    "Please Enter Work Permit Number",
    "Please Enter Work Permit Number"
  ),

  employmentWorkPermitIssuedBy: preprocessString(
    "Please Enter Work Permit Issued By",
    "Please Enter Work Permit Issued By"
  ),

  employmentSsoNumber: preprocessString(
    "Please Enter Sso Number",
    "Please Enter Sso Number"
  ),

  employmentSsoHospital: preprocessString(
    "Please Enter Employment Sso Hospital",
    "Please Enter Employment Sso Hospital"
  ),

  employmentWorkStatus: preprocessEnum(
    ["พนักงาน", "ลาออก"],
    "Employment Status must be either 'พนักงาน', 'ลาออก'."
  ),

  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  ),
});
