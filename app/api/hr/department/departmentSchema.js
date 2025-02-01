import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatDepartmentData(department) {
  return formatData(
    department,
    [],
    ["departmentCreateAt", "departmentUpdateAt"]
  );
}

export const departmentPostSchema = z.object({
  departmentBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),

  departmentDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),

  departmentName: preprocessString(
    "Please Enter Department Name",
    "Please Enter Department Name"
  ),

  departmentCreateBy: preprocessInt(
    "Department creator ID must be provided.",
    "Department creator ID must be an integer."
  ),
});

export const departmentPutSchema = z.object({
  departmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),

  departmentName: preprocessString(
    "Please Enter Department Name",
    "Please Enter Department Name"
  ),

  departmentStatus: preprocessEnum(
    ["Active", "InActive"],
    "Department Status must be either 'Active', 'InActive'."
  ),

  departmentUpdateBy: preprocessInt(
    "Department updater ID must be provided.",
    "Department updater ID must be an integer."
  ),
});
