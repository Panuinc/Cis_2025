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

export function formatRoleData(role) {
  return role.map((role) => ({
    ...role,
    roleCreateAt: formatDate(role.roleCreateAt),
    roleUpdateAt: formatDate(role.roleUpdateAt),
  }));
}

export const rolePosteSchema = z.object({
  roleName: z
    .string({ required_error: "Please Enter Role Name" })
    .min(1, { message: "Please Enter Role Name" }),
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
  roleName: z
    .string({ required_error: "Please Enter Role Name" })
    .min(1, { message: "Please Enter Role Name" }),
  roleStatus: z.enum(["Active", "InActive"], {
    required_error: "Role status must be either 'Active' or 'InActive'.",
    invalid_type_error: "Role status must be either 'Active' or 'InActive'.",
  }),
  roleUpdateBy: preprocessInt(
    "Role updater ID must be provided.",
    "Role updater ID must be an integer."
  ),
});
