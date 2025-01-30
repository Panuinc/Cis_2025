import { z } from "zod";
import {
  preprocessInt,
  preprocessDouble,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatTrainingData(training) {
  return formatData(
    training,
    [],
    [
      "trainingCreateAt",
      "trainingUpdateAt",
      "trainingStartDate",
      "trainingEndDate",
    ]
  );
}

const trainingEmployeeSchema = z.object({
  trainingEmployeeId: preprocessInt(
    "TrainingEmployeeId ID must be provided.",
    "TrainingEmployeeId ID must be an integer."
  ).optional(),

  trainingEmployeeTrainingId: preprocessInt(
    "TrainingEmployeeTrainingId must be provided.",
    "TrainingEmployeeTrainingId must be an integer."
  ).optional(),

  trainingEmployeeEmployeeId: preprocessInt(
    "trainingEmployeeEmployeeId must be provided.",
    "trainingEmployeeEmployeeId must be an integer."
  ).optional(),

  trainingEmployeeResult: preprocessEnum(
    ["Pass", "Not_Pass"],
    "Training Employee Result must be either 'Pass' or 'Not_Pass'."
  ).optional(),

  trainingEmployeeCertificateLink: z
    .string()
    .url("Please provide a valid URL for the certificate link.")
    .optional()
    .refine(
      (val, ctx) => {
        if (ctx.parent.trainingEmployeeResult === "Pass" && !val) {
          return false;
        }
        return true;
      },
      {
        message: "Certificate link is required when result is Pass.",
      }
    ),
});

const trainingEmployeeCheckInSchema = z.object({
  trainingEmployeeCheckInId: preprocessInt(
    "TrainingEmployeeCheckInId ID must be provided.",
    "TrainingEmployeeCheckInId ID must be an integer."
  ).optional(),

  trainingEmployeeCheckInTrainingId: preprocessInt(
    "TrainingEmployeeCheckInTrainingId must be provided.",
    "TrainingEmployeeCheckInTrainingId must be an integer."
  ).optional(),

  trainingEmployeeCheckInEmployeeId: preprocessInt(
    "TrainingEmployeeCheckInEmployeeId must be provided.",
    "TrainingEmployeeCheckInEmployeeId must be an integer."
  ),

  trainingEmployeeCheckInTrainingDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Training Date",
    }
  ),

  trainingEmployeeCheckInMorningCheck: preprocessDate
    .refine()
    .nullable()
    .optional()
    .refine((date) => date === null || date instanceof Date, {
      message: "Please Enter Morning Date",
    }),

  trainingEmployeeCheckInAfterNoonCheck: preprocessDate
    .refine()
    .nullable()
    .optional()
    .refine((date) => date === null || date instanceof Date, {
      message: "Please Enter AfterNoon Date",
    }),
});

export function formatTrainingsData(trainingArray) {
  return trainingArray.map((training) => ({
    ...training,
    trainingEmployee: training.TrainingEmployee,
    trainingEmployeeCheckIn: training.TrainingEmployeeCheckIn,
  }));
}

export const trainingUpdateSchema = z.object({
  trainingId: preprocessInt(
    "Training ID must be provided.",
    "Training ID must be an integer."
  ),

  trainingPreTest: preprocessString(
    "Please Enter Training Pre Test",
    "Please Enter Training Pre Test"
  ).optional(),

  trainingPostTest: preprocessString(
    "Please Enter Training Post Test",
    "Please Enter Training Post Test"
  ).optional(),

  trainingPictureLink: preprocessString(
    "Please Enter Training Picture Link",
    "Please Enter Training Picture Link"
  ).optional(),

  trainingEmployee: z.array(trainingEmployeeSchema).optional(),
  trainingEmployeeCheckIn: z.array(trainingEmployeeCheckInSchema).optional(),

  selectedIds: z.array(z.number()).optional(),
});

export const trainingPosteSchema = z.object({
  trainingType: preprocessEnum(
    [
      "Training_to_prepare_for_work",
      "Training_to_upgrade_labor_skills",
      "Training_to_change_career_fields",
    ],
    "Training Type must be one of 'Training_to_prepare_for_work', 'Training_to_upgrade_labor_skills', or 'Training_to_change_career_fields'."
  ),

  trainingName: preprocessString(
    "Please Enter Training Name",
    "Please Enter Training Name"
  ),

  trainingObjectives: preprocessString(
    "Please Enter Training Objectives",
    "Please Enter Training Objectives"
  ),

  trainingTargetGroup: preprocessString(
    "Please Enter Training Target Group",
    "Please Enter Training Target Group"
  ),

  trainingInstitutionsType: preprocessEnum(
    ["Internal", "External"],
    "Training Type must be either 'Internal' or 'External'."
  ),

  trainingStartDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Start Date",
    }
  ),

  trainingEndDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter End Date",
    }
  ),

  trainingInstitutions: preprocessString(
    "Please Enter Training Institutions",
    "Please Enter Training Institutions"
  ),

  trainingLecturer: preprocessString(
    "Please Enter Training Lecturer",
    "Please Enter Training Lecturer"
  ),

  trainingLocation: preprocessString(
    "Please Enter Training Location",
    "Please Enter Training Location"
  ),

  trainingPrice: preprocessDouble(
    "Please Enter Training Price",
    "Please Enter Training Price"
  ),

  trainingEquipmentPrice: preprocessDouble(
    "Please Enter Training Equipment Price",
    "Please Enter Training Equipment Price"
  ),

  trainingFoodPrice: preprocessDouble(
    "Please Enter Training Food Price",
    "Please Enter Training Food Price"
  ),

  trainingFarePrice: preprocessDouble(
    "Please Enter Training Fare Price",
    "Please Enter Training Fare Price"
  ),

  trainingOtherExpenses: preprocessString(
    "Please Enter Training Other Expenses",
    "Please Enter Training Other Expenses"
  ),

  trainingOtherPrice: preprocessDouble(
    "Please Enter Training Other Price",
    "Please Enter Training Other Price"
  ),

  trainingSumPrice: preprocessDouble(
    "Please Enter Training Sum Price",
    "Please Enter Training Sum Price"
  ).optional(),

  trainingReferenceDocument: preprocessString(
    "Please Enter Training Reference Document",
    "Please Enter Training Reference Document"
  ),

  trainingRemark: preprocessString(
    "Please Enter Training Remark",
    "Please Enter Training Remark"
  ).optional(),

  trainingRequireKnowledge: preprocessString(
    "Please Enter Training Require Knowledge",
    "Please Enter Training Require Knowledge"
  ),

  trainingCreateBy: preprocessInt(
    "Training creator ID must be provided.",
    "Training creator ID must be an integer."
  ),

  trainingEmployee: z.array(trainingEmployeeSchema).optional(),
  trainingEmployeeCheckIn: z.array(trainingEmployeeCheckInSchema).optional(),
});

export const trainingPutSchema = z.object({
  trainingId: preprocessInt(
    "Training ID must be provided.",
    "Training ID must be an integer."
  ),

  trainingType: preprocessEnum(
    [
      "Training_to_prepare_for_work",
      "Training_to_upgrade_labor_skills",
      "Training_to_change_career_fields",
    ],
    "Training Type must be one of 'Training_to_prepare_for_work', 'Training_to_upgrade_labor_skills', or 'Training_to_change_career_fields'."
  ),

  trainingName: preprocessString(
    "Please Enter Training Name",
    "Please Enter Training Name"
  ),

  trainingObjectives: preprocessString(
    "Please Enter Training Objectives",
    "Please Enter Training Objectives"
  ),

  trainingTargetGroup: preprocessString(
    "Please Enter Training Target Group",
    "Please Enter Training Target Group"
  ),

  trainingInstitutionsType: preprocessEnum(
    ["Internal", "External"],
    "Training Type must be either 'Internal', 'External'."
  ),

  trainingStartDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Start Date",
    }
  ),

  trainingEndDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter End Date",
    }
  ),

  trainingInstitutions: preprocessString(
    "Please Enter Training Institutions",
    "Please Enter Training Institutions"
  ),

  trainingLecturer: preprocessString(
    "Please Enter Training Lecturer",
    "Please Enter Training Lecturer"
  ),

  trainingLocation: preprocessString(
    "Please Enter Training Location",
    "Please Enter Training Location"
  ),

  trainingPrice: preprocessDouble(
    "Please Enter Training Price",
    "Please Enter Training Price"
  ),

  trainingEquipmentPrice: preprocessDouble(
    "Please Enter Training Equipment Price",
    "Please Enter Training Equipment Price"
  ),

  trainingFoodPrice: preprocessDouble(
    "Please Enter Training Food Price",
    "Please Enter Training Food Price"
  ),

  trainingFarePrice: preprocessDouble(
    "Please Enter Training Fare Price",
    "Please Enter Training Fare Price"
  ),

  trainingOtherExpenses: preprocessString(
    "Please Enter Training Other Expenses",
    "Please Enter Training Other Expenses"
  ),

  trainingOtherPrice: preprocessDouble(
    "Please Enter Training Other Price",
    "Please Enter Training Other Price"
  ),

  trainingSumPrice: preprocessDouble(
    "Please Enter Training Sum Price",
    "Please Enter Training Sum Price"
  ).optional(),

  trainingReferenceDocument: preprocessString(
    "Please Enter Training Reference Document",
    "Please Enter Training Reference Document"
  ),

  trainingRemark: preprocessString(
    "Please Enter Training Remark",
    "Please Enter Training Remark"
  ).optional(),

  trainingRequireKnowledge: preprocessString(
    "Please Enter Training Require Knowledge",
    "Please Enter Training Require Knowledge"
  ),

  trainingStatus: preprocessEnum(
    ["PendingHrApprove", "Cancel"],
    "Training Status must be either 'PendingHrApprove' or 'Cancel'."
  ),

  trainingUpdateBy: preprocessInt(
    "Training updater ID must be provided.",
    "Training updater ID must be an integer."
  ),
  trainingEmployee: z.array(
    z.object({
      trainingEmployeeEmployeeId: z.number(),
    })
  ),
  trainingEmployeeCheckIn: z.array(
    z.object({
      trainingEmployeeCheckInEmployeeId: z.number(),
      trainingEmployeeCheckInTrainingDate: z.string().nullable(),
      trainingEmployeeCheckInMorningCheck: z.string().nullable(),
      trainingEmployeeCheckInAfterNoonCheck: z.string().nullable(),
    })
  ),
  selectedIds: z.array(z.number()),
});

export const trainingHrApprovePutSchema = z.object({
  trainingId: preprocessInt(
    "Training ID must be provided.",
    "Training ID must be an integer."
  ),

  trainingStatus: preprocessEnum(
    ["PendingMdApprove", "HrCancel"],
    "Training Status must be either 'PendingMdApprove' or 'HrCancel'."
  ),

  trainingReasonHrApproveBy: preprocessInt(
    "Training updater ID must be provided.",
    "Training updater ID must be an integer."
  ),
});

export const trainingMdApprovePutSchema = z.object({
  trainingId: preprocessInt(
    "Training ID must be provided.",
    "Training ID must be an integer."
  ),

  trainingStatus: preprocessEnum(
    ["ApprovedSuccess", "MdCancel"],
    "Training Status must be either 'ApprovedSuccess' or 'MdCancel'."
  ),

  trainingReasonMdApproveBy: preprocessInt(
    "Training updater ID must be provided.",
    "Training updater ID must be an integer."
  ),
});
