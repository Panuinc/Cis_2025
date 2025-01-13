import { z } from "zod";

export const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().replace("T", " ").slice(0, 19);
};

export const formatDateWithoutTime = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().split("T")[0];
};

export const preprocessInt = (requiredMsg, intMsg) =>
  z.preprocess(
    (val) => parseInt(val, 10),
    z.number({ required_error: requiredMsg }).int({ message: intMsg })
  );

export const preprocessString = (requiredMsg, minMsg) =>
  z.string({ required_error: requiredMsg }).min(1, { message: minMsg });

export const preprocessEnum = (validValues, requiredMsg) =>
  z.enum(validValues, { required_error: requiredMsg });

export const preprocessAny = (validValues) =>
  z
    .union([
      z.string(),
      z.string().url("Must be a valid URL"),
      z.object(validValues || {}).partial(),
    ])
    .nullable()
    .optional();

export const preprocessDate = z.preprocess((val) => {
  if (!val) {
    return undefined;
  }

  if (typeof val === "string" || val instanceof Date) {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date;
  }

  return undefined;
}, z.date().optional());

export const formatData = (data, dateFields = [], dateTimeFields = []) =>
  data.map((item) => ({
    ...item,
    ...Object.fromEntries(
      dateFields.map((field) => [field, formatDateWithoutTime(item[field])])
    ),
    ...Object.fromEntries(
      dateTimeFields.map((field) => [field, formatDate(item[field])])
    ),
  }));
