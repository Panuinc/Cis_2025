import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatTrainingData(training) {
  return formatData(training, [], ["trainingCreateAt", "trainingUpdateAt"]);
}

export const trainingPosteSchema = z.object({
  trainingName: preprocessString(
    "Please Enter Training Name",
    "Please Enter Training Name"
  ),

  trainingCreateBy: preprocessInt(
    "Training creator ID must be provided.",
    "Training creator ID must be an integer."
  ),
});

export const trainingPutSchema = z.object({
  trainingId: preprocessInt(
    "Training ID must be provided.",
    "Training ID must be an integer."
  ),

  trainingName: preprocessString(
    "Please Enter Training Name",
    "Please Enter Training Name"
  ),

  trainingStatus: preprocessEnum(
    ["Active", "InActive"],
    "Training Status must be either 'Active', 'InActive'."
  ),

  trainingUpdateBy: preprocessInt(
    "Training updater ID must be provided.",
    "Training updater ID must be an integer."
  ),
});
