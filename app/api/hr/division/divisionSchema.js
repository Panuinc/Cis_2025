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
  return formatData(division, [], ["divisionCreateAt", "divisionUpdateAt"]);
}

export const divisionPosteSchema = z.object({
  divisionBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),

  divisionName: preprocessString(
    "Please Enter Division Name",
    "Please Enter Division Name"
  ),

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

  divisionName: preprocessString(
    "Please Enter Division Name",
    "Please Enter Division Name"
  ),

  divisionStatus: preprocessEnum(
    ["Active", "InActive"],
    "Employment Status must be either 'Active', 'InActive'."
  ),

  divisionUpdateBy: preprocessInt(
    "Division updater ID must be provided.",
    "Division updater ID must be an integer."
  ),
});
