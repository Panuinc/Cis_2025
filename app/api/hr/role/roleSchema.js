import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatRoleData(role) {
  return formatData(role, [], ["roleCreateAt", "roleUpdateAt"]);
}

export const rolePosteSchema = z.object({
  roleName: preprocessString(
    "Please Enter Role Name",
    "Please Enter Role Name"
  ),

  roleCreateBy: preprocessInt(
    "Role creator ID must be provided.",
    "Role creator ID must be an integer."
  ),
});

export const rolePutSchema = z.object({
  roleId: preprocessInt(
    "Role ID must be provided.",
    "Role ID must be an integer."
  ),

  roleName: preprocessString(
    "Please Enter Role Name",
    "Please Enter Role Name"
  ),

  roleStatus: preprocessEnum(
    ["Active", "InActive"],
    "Role Status must be either 'Active', 'InActive'."
  ),

  roleUpdateBy: preprocessInt(
    "Role updater ID must be provided.",
    "Role updater ID must be an integer."
  ),
});
