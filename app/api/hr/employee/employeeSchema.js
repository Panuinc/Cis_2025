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

export function formatEmployeeData(employee) {
  return employee.map((employee) => ({
    ...employee,
    employeeCreateAt: formatDate(employee.employeeCreateAt),
    employeeUpdateAt: formatDate(employee.employeeUpdateAt),
  }));
}

export const employeePosteSchema = z.object({
  employeeBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  employeeDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),
  employeeDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),
  employeeName: z
    .string({ required_error: "Please Enter Employee Name" })
    .min(1, { message: "Please Enter Employee Name" }),
  employeeCreateBy: preprocessInt(
    "Employee creator ID must be provided.",
    "Employee creator ID must be an integer."
  ),
});

export const employeePutSchema = z.object({
  employeeId: preprocessInt(
    "Employee ID must be provided.",
    "Employee ID must be an integer."
  ),
  employeeName: z
    .string({ required_error: "Please Enter Employee Name" })
    .min(1, { message: "Please Enter Employee Name" }),
  employeeStatus: z.enum(["Active", "InActive"], {
    required_error: "Employee status must be either 'Active' or 'InActive'.",
    invalid_type_error:
      "Employee status must be either 'Active' or 'InActive'.",
  }),
  employeeUpdateBy: preprocessInt(
    "Employee updater ID must be provided.",
    "Employee updater ID must be an integer."
  ),
});
