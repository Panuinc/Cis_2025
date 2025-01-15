import { z } from "zod";
import {
  preprocessInt,
  preprocessString,
  preprocessEnum,
  preprocessAny,
  preprocessDate,
  formatData,
} from "@/lib/zodSchema";

export function formatPersonalRequestData(personalRequest) {
  return formatData(
    personalRequest,
    ["personalRequestDesiredDate"],
    ["personalRequestCreateAt", "personalRequestUpdateAt"]
  );
}

export const personalRequestPosteSchema = z.object({
  personalRequestDocumentId: preprocessString(
    "Please Enter PersonalRequest Name",
    "Please Enter PersonalRequest Name"
  ).optional,

  personalRequestAmount: preprocessInt(
    "PersonalRequest Amount must be provided.",
    "PersonalRequest Amount must be an integer."
  ),

  personalRequestBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),

  personalRequestDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),

  personalRequestDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),

  personalRequestPositionId: preprocessInt(
    "Position ID must be provided.",
    "Position ID must be an integer."
  ),

  personalRequestDesiredDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Desired Date",
    }
  ),

  personalRequestEmploymentType: preprocessEnum(
    ["FULL_TIME", "PART_TIME", "TEMPORARY", "CONTRACT", "INTERN"],
    "PersonalRequest EMployee TYpe must be either 'FULL_TIME', 'PART_TIME', 'TEMPORARY', 'CONTRACT', 'INTERN'."
  ),

  personalRequestReasonForRequest: preprocessEnum(
    ["REPLACE_STAFF", "NEW_POSITION", "EXPANSION", "OTHER"],
    "PersonalRequest Reason For Request must be either 'REPLACE_STAFF', 'NEW_POSITION', 'EXPANSION', 'OTHER'."
  ),

  personalRequestReasonGender: preprocessEnum(
    ["Male", "FeMale"],
    "PersonalRequest Gender must be either 'Male', 'FeMale'."
  ),

  personalRequestReasonAge: preprocessInt(
    "Reason Age must be provided.",
    "Reason Age must be an integer."
  ),

  personalRequestReasonEducation: preprocessString(
    "Please Enter Education",
    "Please Enter Education"
  ),

  personalRequestReasonEnglishSkill: preprocessEnum(
    ["BASIC", "INTERMEDIATE", "ADVANCED"],
    "PersonalRequest Gender must be either 'BASIC', 'INTERMEDIATE', 'ADVANCED'."
  ),

  personalRequestReasonComputerSkill: preprocessEnum(
    ["BASIC", "INTERMEDIATE", "ADVANCED"],
    "PersonalRequest Gender must be either 'BASIC', 'INTERMEDIATE', 'ADVANCED'."
  ),

  personalRequestReasonOtherSkill: preprocessString(
    "Please Enter Other Skill",
    "Please Enter Other Skill"
  ),

  personalRequestReasonExperience: preprocessString(
    "Please Enter Experience",
    "Please Enter Experience"
  ),

  personalRequestCreateBy: preprocessInt(
    "PersonalRequest creator ID must be provided.",
    "PersonalRequest creator ID must be an integer."
  ),
});

export const personalRequestPutSchema = z.object({
  personalRequestId: preprocessInt(
    "PersonalRequest ID must be provided.",
    "PersonalRequest ID must be an integer."
  ),

  personalRequestAmount: preprocessInt(
    "PersonalRequest Amount must be provided.",
    "PersonalRequest Amount must be an integer."
  ),

  personalRequestBranchId: preprocessInt(
    "Branch ID must be provided.",
    "Branch ID must be an integer."
  ),

  personalRequestDivisionId: preprocessInt(
    "Division ID must be provided.",
    "Division ID must be an integer."
  ),

  personalRequestDepartmentId: preprocessInt(
    "Department ID must be provided.",
    "Department ID must be an integer."
  ),

  personalRequestPositionId: preprocessInt(
    "Position ID must be provided.",
    "Position ID must be an integer."
  ),

  personalRequestDesiredDate: preprocessDate.refine(
    (date) => date === null || date instanceof Date,
    {
      message: "Please Enter Desired Date",
    }
  ),

  personalRequestEmploymentType: preprocessEnum(
    ["FULL_TIME", "PART_TIME", "TEMPORARY", "CONTRACT", "INTERN"],
    "PersonalRequest EMployee TYpe must be either 'FULL_TIME', 'PART_TIME', 'TEMPORARY', 'CONTRACT', 'INTERN'."
  ),

  personalRequestReasonForRequest: preprocessEnum(
    ["REPLACE_STAFF", "NEW_POSITION", "EXPANSION", "OTHER"],
    "PersonalRequest Reason For Request must be either 'REPLACE_STAFF', 'NEW_POSITION', 'EXPANSION', 'OTHER'."
  ),

  personalRequestReasonGender: preprocessEnum(
    ["Male", "FeMale"],
    "PersonalRequest Gender must be either 'Male', 'FeMale'."
  ),

  personalRequestReasonAge: preprocessInt(
    "Reason Age must be provided.",
    "Reason Age must be an integer."
  ),

  personalRequestReasonEducation: preprocessString(
    "Please Enter Education",
    "Please Enter Education"
  ),

  personalRequestReasonEnglishSkill: preprocessEnum(
    ["BASIC", "INTERMEDIATE", "ADVANCED"],
    "PersonalRequest Gender must be either 'BASIC', 'INTERMEDIATE', 'ADVANCED'."
  ),

  personalRequestReasonComputerSkill: preprocessEnum(
    ["BASIC", "INTERMEDIATE", "ADVANCED"],
    "PersonalRequest Gender must be either 'BASIC', 'INTERMEDIATE', 'ADVANCED'."
  ),

  personalRequestReasonOtherSkill: preprocessString(
    "Please Enter Other Skill",
    "Please Enter Other Skill"
  ),

  personalRequestReasonExperience: preprocessString(
    "Please Enter Experience",
    "Please Enter Experience"
  ),

  personalRequestStatus: preprocessEnum(
    ["PendingManagerApprove", "Cancel"],
    "PersonalRequest Status must be either 'PendingManagerApprove', 'Cancel'."
  ),

  personalRequestUpdateBy: preprocessInt(
    "PersonalRequest updater ID must be provided.",
    "PersonalRequest updater ID must be an integer."
  ),
});

export const personalRequestManagerApprovePutSchema = z.object({
  personalRequestId: preprocessInt(
    "PersonalRequest ID must be provided.",
    "PersonalRequest ID must be an integer."
  ),

  personalRequestStatus: preprocessEnum(
    ["PendingHrApprove", "ManagerCancel"],
    "PersonalRequest Status must be either 'PendingHrApprove', 'ManagerCancel'."
  ),

  personalRequestReasonManagerApproveBy: preprocessInt(
    "PersonalRequest updater ID must be provided.",
    "PersonalRequest updater ID must be an integer."
  ),
});

export const personalRequestHrApprovePutSchema = z.object({
  personalRequestId: preprocessInt(
    "PersonalRequest ID must be provided.",
    "PersonalRequest ID must be an integer."
  ),

  personalRequestStatus: preprocessEnum(
    ["PendingMdApprove", "HrCancel"],
    "PersonalRequest Status must be either 'PendingMdApprove', 'HrCancel'."
  ),

  personalRequestReasonHrApproveBy: preprocessInt(
    "PersonalRequest updater ID must be provided.",
    "PersonalRequest updater ID must be an integer."
  ),
});

export const personalRequestMdApprovePutSchema = z.object({
  personalRequestId: preprocessInt(
    "PersonalRequest ID must be provided.",
    "PersonalRequest ID must be an integer."
  ),

  personalRequestStatus: preprocessEnum(
    ["ApprovedSuccess", "MdCancel"],
    "PersonalRequest Status must be either 'ApprovedSuccess', 'MdCancel'."
  ),

  personalRequestReasonMdApproveBy: preprocessInt(
    "PersonalRequest updater ID must be provided.",
    "PersonalRequest updater ID must be an integer."
  ),
});
