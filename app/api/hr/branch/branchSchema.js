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

export function formatBranchData(branch) {
  return branch.map((branch) => ({
    ...branch,
    branchCreateAt: formatDate(branch.branchCreateAt),
    branchUpdateAt: formatDate(branch.branchUpdateAt),
  }));
}

export const branchPosteSchema = z.object({
  branchName: z
    .string({ required_error: "Please Enter Branch Name" })
    .min(1, { message: "Please Enter Branch Name" }),
  branchCreateBy: preprocessInt(
    "Branch creator ID must be provided.",
    "Branch creator ID must be an integer."
  ),
});

export const branchPutSchema = z.object({
  branchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  branchName: z
    .string({ required_error: "Please Enter Branch Name" })
    .min(1, { message: "Please Enter Branch Name" }),
  branchStatus: z.enum(["Active", "InActive"], {
    required_error: "Branch status must be either 'Active' or 'InActive'.",
    invalid_type_error: "Branch status must be either 'Active' or 'InActive'.",
  }),
  branchUpdateBy: preprocessInt(
    "Branch updater ID must be provided.",
    "Branch updater ID must be an integer."
  ),
});
