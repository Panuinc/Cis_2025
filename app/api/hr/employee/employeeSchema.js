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

export function formatEmployeeData(employee) {
  return employee.map((employee) => ({
    ...employee,
    employeeBirthday: formatDateWithoutTime(employee.employeeBirthday),
    employeeCreateAt: formatDate(employee.employeeCreateAt),
    employeeUpdateAt: formatDate(employee.employeeUpdateAt),
  }));
}

export const employeePosteSchema = z.object({
  employeeTitle: z.enum(["Mr", "Ms", "Mrs"], {
    required_error: "Employee Title must be either 'Mr' or 'Ms' or 'Mrs'.",
    invalid_type_error: "Employee Title must be either 'Mr' or 'Ms' or 'Mrs'.",
  }),
  employeeFirstname: z
    .string({ required_error: "Please Enter First Name" })
    .min(1, { message: "Please Enter First Name" }),
  employeeLastname: z
    .string({ required_error: "Please Enter Last Name" })
    .min(1, { message: "Please Enter Last Name" }),
  employeeNickname: z
    .string({ required_error: "Please Enter Nick Name" })
    .min(1, { message: "Please Enter Nick Name" }),
  employeeEmail: z
    .string({ required_error: "Please Enter Email" })
    .email({ message: "Please enter a valid Email" }),
  employeeTel: z
    .string({ required_error: "Please Enter Telephone" })
    .min(1, { message: "Please Enter Telephone" }),
  employeeIdCard: z
    .string({ required_error: "Please Enter ID Card" })
    .min(1, { message: "Please Enter ID Card" }),
  employeeBirthday: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Birthday must be a valid date and not in the future" }
  ),
  employeeCitizen: z.enum(
    ["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"],
    {
      required_error:
        "Employee Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
      invalid_type_error:
        "Employee Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
    }
  ),
  employeeGender: z.enum(["Male", "FeMale"], {
    required_error: "Employee Gender must be either 'Male' or 'FeMale'.",
    invalid_type_error: "Employee Gender must be either 'Male' or 'FeMale'.",
  }),
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
  employeeTitle: z.enum(["Mr", "Ms", "Mrs"], {
    required_error: "Employee Title must be either 'Mr' or 'Ms' or 'Mrs'.",
    invalid_type_error: "Employee Title must be either 'Mr' or 'Ms' or 'Mrs'.",
  }),
  employeeFirstname: z
    .string({ required_error: "Please Enter First Name" })
    .min(1, { message: "Please Enter First Name" }),
  employeeLastname: z
    .string({ required_error: "Please Enter Last Name" })
    .min(1, { message: "Please Enter Last Name" }),
  employeeNickname: z
    .string({ required_error: "Please Enter Nick Name" })
    .min(1, { message: "Please Enter Nick Name" }),
  employeeEmail: z
    .string({ required_error: "Please Enter Email" })
    .email({ message: "Please enter a valid Email" }),
  employeeTel: z
    .string({ required_error: "Please Enter Telephone" })
    .min(1, { message: "Please Enter Telephone" }),
  employeeIdCard: z
    .string({ required_error: "Please Enter ID Card" })
    .min(1, { message: "Please Enter ID Card" }),
  employeeBirthday: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Birthday must be a valid date and not in the future" }
  ),
  employeeCitizen: z.enum(
    ["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"],
    {
      required_error:
        "Employee Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
      invalid_type_error:
        "Employee Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
    }
  ),
  employeeGender: z.enum(["Male", "FeMale"], {
    required_error: "Employee Gender must be either 'Male' or 'FeMale'.",
    invalid_type_error: "Employee Gender must be either 'Male' or 'FeMale'.",
  }),
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
