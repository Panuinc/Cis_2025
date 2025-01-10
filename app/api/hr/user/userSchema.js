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

export function formatUserData(user) {
  return user.map((user) => ({
    ...user,
    userCreateAt: formatDate(user.userCreateAt),
    userUpdateAt: formatDate(user.userUpdateAt),
  }));
}

export const userPutSchema = z.object({
  userId: preprocessInt(
    "User ID must be provided.",
    "User ID must be an integer."
  ),
  userUsername: z
    .string({ required_error: "Please Enter Username" })
    .min(1, { message: "Please Enter Username" }),
  userPassword: z
    .string({ required_error: "Please Enter Password" })
    .min(1, { message: "Please Enter Password" }),
  userUpdateBy: preprocessInt(
    "User updater ID must be provided.",
    "User updater ID must be an integer."
  ),
});
