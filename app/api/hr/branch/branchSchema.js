import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatBranchData(branch) {
  return formatData(branch, [], ["branchCreateAt", "branchUpdateAt"]);
}

export const branchPostSchema = z.object({
  branchName: preprocessString(
    "Please Enter Branch Name",
    "Please Enter Branch Name"
  ),

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

  branchName: preprocessString(
    "Please Enter Branch Name",
    "Please Enter Branch Name"
  ),

  branchStatus: preprocessEnum(
    ["Active", "InActive"],
    "Branch Status must be either 'Active', 'InActive'."
  ),

  branchUpdateBy: preprocessInt(
    "Branch updater ID must be provided.",
    "Branch updater ID must be an integer."
  ),
});
