import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatCvData(cv) {
  return formatData(cv, [], ["cvCreateAt", "cvUpdateAt"]);
}

export const cvPosteSchema = z.object({
  cvEmployeeId: preprocessInt(
    "Please Enter Cv Name",
    "Please Enter Cv Name"
  ),

  cvCreateBy: preprocessInt(
    "Cv creator ID must be provided.",
    "Cv creator ID must be an integer."
  ),
});

export const cvPutSchema = z.object({
  cvId: preprocessInt("Cv ID must be provided.", "Cv ID must be an integer."),

  cvEmployeeId: preprocessInt(
    "Please Enter Cv Name",
    "Please Enter Cv Name"
  ),

  cvUpdateBy: preprocessInt(
    "Cv updater ID must be provided.",
    "Cv updater ID must be an integer."
  ),
});
