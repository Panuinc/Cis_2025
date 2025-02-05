import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatPositionData(position) {
  return formatData(position, [], ["positionCreateAt", "positionUpdateAt"]);
}

export const positionPostSchema = z.object({
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

  positionNameTH: preprocessString(
    "Please Enter Position Name TH",
    "Please Enter Position Name TH"
  ),

  positionNameEN: preprocessString(
    "Please Enter Position Name EN",
    "Please Enter Position Name EN"
  ),

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

  positionNameTH: preprocessString(
    "Please Enter Position Name TH",
    "Please Enter Position Name TH"
  ),

  positionNameEN: preprocessString(
    "Please Enter Position Name EN",
    "Please Enter Position Name EN"
  ),

  positionStatus: preprocessEnum(
    ["Active", "InActive"],
    "Position Status must be either 'Active', 'InActive'."
  ),

  positionUpdateBy: preprocessInt(
    "Position updater ID must be provided.",
    "Position updater ID must be an integer."
  ),
});
