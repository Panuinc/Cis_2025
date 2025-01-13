import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatEmpDocumentData(empDocument) {
  return formatData(
    empDocument,
    [],
    ["empDocumentCreateAt", "empDocumentUpdateAt"]
  );
}

export const empDocumentPutSchema = z.object({
  empDocumentId: preprocessInt(
    "EmpDocument ID must be provided.",
    "EmpDocument ID must be an integer."
  ),

  empDocumentIdCardFile: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentHomeFile: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentUpdateBy: preprocessInt(
    "EmpDocument updater ID must be provided.",
    "EmpDocument updater ID must be an integer."
  ),
});

export const empDocumentPatchSchema = z.object({
  empDocumentId: preprocessInt(
    "EmpDocument ID must be provided.",
    "EmpDocument ID must be an integer."
  ),

  empDocumentSumFile: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentPassportFile: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentImmigrationFile: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentVisa1File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentVisa2File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentVisa3File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentVisa4File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentVisa5File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentWorkPermit1File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentWorkPermit2File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentWorkPermit3File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentWorkPermit4File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentWorkPermit5File: preprocessAny({
    url: z.string(),
    description: z.string(),
  }),

  empDocumentUpdateBy: preprocessInt(
    "EmpDocument updater ID must be provided.",
    "EmpDocument updater ID must be an integer."
  ),
});
