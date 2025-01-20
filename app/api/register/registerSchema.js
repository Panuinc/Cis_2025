import { z } from "zod";

export const registerSchema = z.object({
  employeeTitle: z.enum(["Mr", "Ms", "Mrs"], {errorMap: () => ({ message: "Employee status must be either 'Mr' or 'Ms' or 'Mrs'" }),}),  
  employeeFirstname: z.string().min(1, { message: "Please Enter Firstname" }),
  employeeLastname: z.string().min(1, { message: "Please Enter Lastname" }),
  employeeNickname: z.string().min(1, { message: "Please Enter Nickname" }),
  employeeEmail:  z.string().email("Invalid email address").max(255),
  employeeTel: z.string().regex(/^\d{10}$/, "Invalid phone number").optional(),
  employeeIdCard: z.string().min(1, { message: "Please Enter ID Card" }),
  employeeCitizen: z.enum(["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"], {errorMap: () => ({ message: "Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'" }),}),  
  employeeGender: z.enum(["Male", "FeMale"], {errorMap: () => ({ message: "Gender must be either 'Male' or 'FeMale'" }),}),  
  employeeBirthday: z.union([z.string(), z.date()]).refine((val) => {const date = typeof val === "string" ? new Date(val) : val;return date <= new Date();}, {message: "Birthday must be a valid date and not in the future",}),
});