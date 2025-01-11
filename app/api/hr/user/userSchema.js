import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatUserData(user) {
  return formatData(user, [], ["userCreateAt", "userUpdateAt"]);
}

export const userPutSchema = z.object({
  userId: preprocessInt(
    "User ID must be provided.",
    "User ID must be an integer."
  ),

  userUsername: preprocessString(
    "Please Enter Username",
    "Please Enter Username"
  ),

  userPassword: preprocessString(
    "Please Enter Password",
    "Please Enter Password"
  ),

  userUpdateBy: preprocessInt(
    "User updater ID must be provided.",
    "User updater ID must be an integer."
  ),
});
