import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatSiteData(site) {
  return formatData(site, [], ["siteCreateAt", "siteUpdateAt"]);
}

export const sitePosteSchema = z.object({
  siteBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),

  siteName: preprocessString(
    "Please Enter Site Name",
    "Please Enter Site Name"
  ),

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

  siteName: preprocessString(
    "Please Enter Site Name",
    "Please Enter Site Name"
  ),

  siteStatus: preprocessEnum(
    ["Active", "InActive"],
    "Site Status must be either 'Active', 'InActive'."
  ),

  siteUpdateBy: preprocessInt(
    "Site updater ID must be provided.",
    "Site updater ID must be an integer."
  ),
});
