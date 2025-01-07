import { z } from "zod";

export const branchPosteSchema = z.object({
  branchName: z.string().min(1, { message: "Please Enter Branch Name" }),
  branchCreateBy: z.preprocess((val) => parseInt(val, 10),z.number().int({ message: "Branch creator ID must be an integer." })),});

export const branchPutSchema = z.object({
  branchId: z.preprocess((val) => parseInt(val, 10), z.number().int()),
  branchName: z.string().min(1, { message: "Please Enter Branch Name" }),
  branchStatus: z.enum(["Active", "InActive"], {errorMap: () => ({ message: "Branch status must be either 'Active' or 'InActive'." }),}),  
  branchUpdateBy: z.preprocess((val) => parseInt(val, 10),z.number().int({ message: "Branch updater ID must be an integer." })),});