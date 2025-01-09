import { z } from "zod";

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().replace("T", " ").slice(0, 19);
};

const preprocessInt = (requiredMsg, intMsg) =>
  z.preprocess(
    (val) => parseInt(val, 10),
    z.number({ required_error: requiredMsg }).int({ message: intMsg })
  );

export function formatDepartmentData(department) {
  return department.map((department) => ({
    ...department,
    departmentCreateAt: formatDate(department.departmentCreateAt),
    departmentUpdateAt: formatDate(department.departmentUpdateAt),
  }));
}

export const departmentPosteSchema = z.object({
  departmentBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  departmentDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),
  departmentName: z
    .string({ required_error: "Please Enter Department Name" })
    .min(1, { message: "Please Enter Department Name" }),
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
  departmentName: z
    .string({ required_error: "Please Enter Department Name" })
    .min(1, { message: "Please Enter Department Name" }),
  departmentStatus: z.enum(["Active", "InActive"], {
    required_error: "Department status must be either 'Active' or 'InActive'.",
    invalid_type_error:
      "Department status must be either 'Active' or 'InActive'.",
  }),
  departmentUpdateBy: preprocessInt(
    "Department updater ID must be provided.",
    "Department updater ID must be an integer."
  ),
});
