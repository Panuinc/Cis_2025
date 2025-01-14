import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatResumeData(resume) {
  return formatData(resume, [], ["resumeCreateAt", "resumeUpdateAt"]);
}

export const resumePutSchema = z.object({
  resumeId: preprocessInt(
    "Resume ID must be provided.",
    "Resume ID must be an integer."
  ),

  resumeLink: preprocessString(
    "Please Enter Resume Link",
    "Please Enter Resume Link"
  ),

  resumeUpdateBy: preprocessInt(
    "Resume updater ID must be provided.",
    "Resume updater ID must be an integer."
  ),
});
