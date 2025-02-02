import { z } from "zod";
import { preprocessInt } from "@/lib/zodSchema";

export const employmentTransferPostSchema = z.object({
  employmentId: preprocessInt(
    "Employment ID is required.",
    "Employment ID must be an integer."
  ),
  employmentBranchId: preprocessInt(
    "Branch ID is required.",
    "Branch ID must be an integer."
  ),
  employmentSiteId: preprocessInt(
    "Site ID is required.",
    "Site ID must be an integer."
  ),
  employmentDivisionId: preprocessInt(
    "Division ID is required.",
    "Division ID must be an integer."
  ),
  employmentDepartmentId: preprocessInt(
    "Department ID is required.",
    "Department ID must be an integer."
  ),
  employmentParentId: preprocessInt(
    "Parent ID is required.",
    "Parent ID must be an integer."
  ),
  employmentUpdateBy: preprocessInt(
    "Updater ID must be provided.",
    "Updater ID must be an integer."
  ),
});

export const employmentTransferBulkSchema = z.array(
  employmentTransferPostSchema
);
