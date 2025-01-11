import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatDivisionData(division) {
  return formatData(
    division,
    ["employeeBirthday"],
    ["employeeCreateAt", "employeeUpdateAt"]
  );
}

export const employeePosteSchema = z.object({
  employeeTitle: preprocessEnum(
    ["Mr", "Ms", "Mrs"],
    "Employment Title must be either 'Mr', 'Ms', 'Mrs'."
  ),

  employeeFirstname: preprocessString(
    "Please Enter Firstname",
    "Please Enter Firstname"
  ),

  employeeLastname: preprocessString(
    "Please Enter Lastname",
    "Please Enter Lastname"
  ),

  employeeNickname: preprocessString(
    "Please Enter Nickname",
    "Please Enter Nickname"
  ),

  employeeEmail: preprocessString(
    "Please Enter EmailAddress",
    "Please Enter EmailAddress"
  ),

  employeeTel: preprocessString(
    "Please Enter Telephone",
    "Please Enter Telephone"
  ),

  employeeIdCard: preprocessString(
    "Please Enter ID Card",
    "Please Enter ID Card"
  ),

  employeeBirthday: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Birth Day",
    }
  ),

  employeeCitizen: preprocessEnum(
    ["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"],
    "Employment Citizen must be either 'Thai', 'Cambodian', 'Lao', 'Burmese', 'Vietnamese'."
  ),

  employeeGender: preprocessEnum(
    ["Male", "FeMale"],
    "Employment Gender must be either 'Male', 'FeMale'."
  ),

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
  employeeTitle: preprocessEnum(
    ["Mr", "Ms", "Mrs"],
    "Employment Title must be either 'Mr', 'Ms', 'Mrs'."
  ),

  employeeFirstname: preprocessString(
    "Please Enter Firstname",
    "Please Enter Firstname"
  ),

  employeeLastname: preprocessString(
    "Please Enter Lastname",
    "Please Enter Lastname"
  ),

  employeeNickname: preprocessString(
    "Please Enter Nickname",
    "Please Enter Nickname"
  ),

  employeeEmail: preprocessString(
    "Please Enter EmailAddress",
    "Please Enter EmailAddress"
  ),

  employeeTel: preprocessString(
    "Please Enter Telephone",
    "Please Enter Telephone"
  ),

  employeeIdCard: preprocessString(
    "Please Enter ID Card",
    "Please Enter ID Card"
  ),

  employeeBirthday: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Birth Day",
    }
  ),

  employeeCitizen: preprocessEnum(
    ["Thai", "Cambodian", "Lao", "Burmese", "Vietnamese"],
    "Employment Citizen must be either 'Thai', 'Cambodian', 'Lao', 'Burmese', 'Vietnamese'."
  ),

  employeeGender: preprocessEnum(
    ["Male", "FeMale"],
    "Employment Gender must be either 'Male', 'FeMale'."
  ),

  employeeStatus: preprocessEnum(
    ["Active", "InActive"],
    "Employment Status must be either 'Active', 'InActive'."
  ),

  employeeUpdateBy: preprocessInt(
    "Employee updater ID must be provided.",
    "Employee updater ID must be an integer."
  ),
});
