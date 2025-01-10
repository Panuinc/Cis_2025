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

export function formatEmploymentData(employment) {
  return employment.map((employment) => ({
    ...employment,
    employmentCreateAt: formatDate(employment.employmentCreateAt),
    employmentUpdateAt: formatDate(employment.employmentUpdateAt),
  }));
}

export const employmentPutSchema = z.object({
  employmentId: preprocessInt(
    "Employment ID must be provided.",
    "Employment ID must be an integer."
  ),
  employmentTitle: z.enum(["Mr", "Ms", "Mrs"], {
    required_error: "Employment Title must be either 'Mr' or 'Ms' or 'Mrs'.",
    invalid_type_error: "Employment Title must be either 'Mr' or 'Ms' or 'Mrs'.",
  }),
  employmentFirstname: z
    .string({ required_error: "Please Enter First Name" })
    .min(1, { message: "Please Enter First Name" }),
  employmentLastname: z
    .string({ required_error: "Please Enter Last Name" })
    .min(1, { message: "Please Enter Last Name" }),
  employmentNickname: z
    .string({ required_error: "Please Enter Nick Name" })
    .min(1, { message: "Please Enter Nick Name" }),
  employmentEmail: z
    .string({ required_error: "Please Enter Email" })
    .email({ message: "Please enter a valid Email" }),
  employmentTel: z
    .string({ required_error: "Please Enter Telephone" })
    .min(1, { message: "Please Enter Telephone" }),
  employmentIdCard: z
    .string({ required_error: "Please Enter ID Card" })
    .min(1, { message: "Please Enter ID Card" }),
  employmentBirthday: z.union([z.string(), z.date()]).refine(
    (val) => {
      const date = typeof val === "string" ? new Date(val) : val;
      return date <= new Date();
    },
    { message: "Birthday must be a valid date and not in the future" }
  ),
  employmentCitizen: z.enum(
    ["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"],
    {
      required_error:
        "Employment Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
      invalid_type_error:
        "Employment Citizen must be either 'Thai' or 'Cambodian' or 'Lao' or 'Burmese' or 'Vietnamese'.",
    }
  ),
  employmentGender: z.enum(["Male", "FeMale"], {
    required_error: "Employment Gender must be either 'Male' or 'FeMale'.",
    invalid_type_error: "Employment Gender must be either 'Male' or 'FeMale'.",
  }),
  employmentStatus: z.enum(["Active", "InActive"], {
    required_error: "Employment status must be either 'Active' or 'InActive'.",
    invalid_type_error:
      "Employment status must be either 'Active' or 'InActive'.",
  }),
  employmentUpdateBy: preprocessInt(
    "Employment updater ID must be provided.",
    "Employment updater ID must be an integer."
  ),
});
