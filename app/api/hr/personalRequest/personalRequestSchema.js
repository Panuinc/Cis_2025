import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatPersonalRequestData(personalRequest) {
  return formatData(personalRequest, [], ["personalRequestCreateAt", "personalRequestUpdateAt"]);
}

export const personalRequestPosteSchema = z.object({
  personalRequestDocumentId: preprocessString(
    "Please Enter PersonalRequest Name",
    "Please Enter PersonalRequest Name"
  ),

  personalRequestCreateBy: preprocessInt(
    "PersonalRequest creator ID must be provided.",
    "PersonalRequest creator ID must be an integer."
  ),
});

export const personalRequestPutSchema = z.object({
  personalRequestId: preprocessInt(
    "PersonalRequest ID must be provided.",
    "PersonalRequest ID must be an integer."
  ),

  personalRequestDocumentId: preprocessString(
    "Please Enter PersonalRequest Name",
    "Please Enter PersonalRequest Name"
  ),

  personalRequestStatus: preprocessEnum(
    ["Active", "InActive"],
    "PersonalRequest Status must be either 'Active', 'InActive'."
  ),

  personalRequestUpdateBy: preprocessInt(
    "PersonalRequest updater ID must be provided.",
    "PersonalRequest updater ID must be an integer."
  ),
});
