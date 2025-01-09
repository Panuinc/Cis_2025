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

export function formatDivisionData(division) {
  return division.map((division) => ({
    ...division,
    divisionCreateAt: formatDate(division.divisionCreateAt),
    divisionUpdateAt: formatDate(division.divisionUpdateAt),
  }));
}

export const divisionPosteSchema = z.object({
  divisionBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  divisionName: z
    .string({ required_error: "Please Enter Division Name" })
    .min(1, { message: "Please Enter Division Name" }),
  divisionCreateBy: preprocessInt(
    "Division creator ID must be provided.",
    "Division creator ID must be an integer."
  ),
});

export const divisionPutSchema = z.object({
  divisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),
  divisionName: z
    .string({ required_error: "Please Enter Division Name" })
    .min(1, { message: "Please Enter Division Name" }),
  divisionStatus: z.enum(["Active", "InActive"], {
    required_error: "Division status must be either 'Active' or 'InActive'.",
    invalid_type_error: "Division status must be either 'Active' or 'InActive'.",
  }),
  divisionUpdateBy: preprocessInt(
    "Division updater ID must be provided.",
    "Division updater ID must be an integer."
  ),
});
