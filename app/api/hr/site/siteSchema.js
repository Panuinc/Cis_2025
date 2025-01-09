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

export function formatSiteData(site) {
  return site.map((site) => ({
    ...site,
    siteCreateAt: formatDate(site.siteCreateAt),
    siteUpdateAt: formatDate(site.siteUpdateAt),
  }));
}

export const sitePosteSchema = z.object({
  siteBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),
  siteName: z
    .string({ required_error: "Please Enter Site Name" })
    .min(1, { message: "Please Enter Site Name" }),
  siteCreateBy: preprocessInt(
    "Site creator ID must be provided.",
    "Site creator ID must be an integer."
  ),
});

export const sitePutSchema = z.object({
  siteId: preprocessInt(
    "Site ID must be provided.",
    "Site ID must be an integer."
  ),
  siteName: z
    .string({ required_error: "Please Enter Site Name" })
    .min(1, { message: "Please Enter Site Name" }),
  siteStatus: z.enum(["Active", "InActive"], {
    required_error: "Site status must be either 'Active' or 'InActive'.",
    invalid_type_error: "Site status must be either 'Active' or 'InActive'.",
  }),
  siteUpdateBy: preprocessInt(
    "Site updater ID must be provided.",
    "Site updater ID must be an integer."
  ),
});
