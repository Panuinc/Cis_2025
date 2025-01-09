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

export function formatPositionData(position) {
  return position.map((position) => ({
    ...position,
    positionCreateAt: formatDate(position.positionCreateAt),
    positionUpdateAt: formatDate(position.positionUpdateAt),
  }));
}

export const positionPosteSchema = z.object({
  positionBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  positionDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),
  positionDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),
  positionName: z
    .string({ required_error: "Please Enter Position Name" })
    .min(1, { message: "Please Enter Position Name" }),
  positionCreateBy: preprocessInt(
    "Position creator ID must be provided.",
    "Position creator ID must be an integer."
  ),
});

export const positionPutSchema = z.object({
  positionId: preprocessInt(
    "Position ID must be provided.",
    "Position ID must be an integer."
  ),
  positionName: z
    .string({ required_error: "Please Enter Position Name" })
    .min(1, { message: "Please Enter Position Name" }),
  positionStatus: z.enum(["Active", "InActive"], {
    required_error: "Position status must be either 'Active' or 'InActive'.",
    invalid_type_error:
      "Position status must be either 'Active' or 'InActive'.",
  }),
  positionUpdateBy: preprocessInt(
    "Position updater ID must be provided.",
    "Position updater ID must be an integer."
  ),
});
