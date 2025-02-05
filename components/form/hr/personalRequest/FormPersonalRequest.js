"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormPersonalRequest({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  filtereddivision,
  filtereddepartment,
  filteredposition,
  isbranchselected,
  isBranchAndDivisionSelected,
  isBranchAndDivisionAndDepartmentSelected,
  branch,
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",
  amPosition = "",
  amDepartment = "",
  isParentOfCreator = false,
  onManagerApprove,
  onManagerReject,
  isHRManager, // ส่งค่า isHRManager
  isMD, // ส่งค่า isMD
  onHrApprove,
  onHrReject,
  onMdApprove,
  onMdReject,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="Operated By"
            type="text"
            label="Operated By"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={operatedBy}
            isReadOnly={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="Position Name"
            type="text"
            label="Position Name"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={amPosition}
            isReadOnly={true}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="Department Name"
            type="text"
            label="Department Name"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={amDepartment}
            isReadOnly={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestAmount"
            type="number"
            label="PersonalRequest Amount"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestAmount || ""}
            onChange={handleInputChange("personalRequestAmount")}
            isInvalid={!!errors.personalRequestAmount}
            errorMessage={errors.personalRequestAmount}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestBranchId"
            label="Branch Name"
            placeholder="Please Select Branch Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestBranchId?.toString() || ""}
            selectedKeys={[formData.personalRequestBranchId?.toString() || ""]}
            onChange={handleInputChange("personalRequestBranchId")}
            isInvalid={!!errors.personalRequestBranchId}
            errorMessage={errors.personalRequestBranchId}
          >
            {branch.map((branch) => (
              <SelectItem key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestDivisionId"
            label="Division Name"
            placeholder="Please Select Division Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestDivisionId?.toString() || ""}
            selectedKeys={[
              formData.personalRequestDivisionId?.toString() || "",
            ]}
            onChange={handleInputChange("personalRequestDivisionId")}
            isDisabled={!isbranchselected}
            isInvalid={!!errors.personalRequestDivisionId}
            errorMessage={errors.personalRequestDivisionId}
          >
            {filtereddivision.map((division) => (
              <SelectItem key={division.divisionId} value={division.divisionId}>
                {division.divisionName}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestDepartmentId"
            label="Department Name"
            placeholder="Please Select Department Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestDepartmentId?.toString() || ""}
            selectedKeys={[
              formData.personalRequestDepartmentId?.toString() || "",
            ]}
            onChange={handleInputChange("personalRequestDepartmentId")}
            isDisabled={!isBranchAndDivisionSelected}
            isInvalid={!!errors.personalRequestDepartmentId}
            errorMessage={errors.personalRequestDepartmentId}
          >
            {filtereddepartment.map((department) => (
              <SelectItem
                key={department.departmentId}
                value={department.departmentId}
              >
                {department.departmentName}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestPositionId"
            label="Position Name"
            placeholder="Please Select Position Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestPositionId?.toString() || ""}
            selectedKeys={[
              formData.personalRequestPositionId?.toString() || "",
            ]}
            onChange={handleInputChange("personalRequestPositionId")}
            isDisabled={!isBranchAndDivisionAndDepartmentSelected}
            isInvalid={!!errors.personalRequestPositionId}
            errorMessage={errors.personalRequestPositionId}
          >
            {filteredposition.map((position) => (
              <SelectItem key={position.positionId} value={position.positionId}>
                {position.positionNameTH}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestDesiredDate"
            type="date"
            label="PersonalRequest DEsired Date"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestDesiredDate || ""}
            onChange={handleInputChange("personalRequestDesiredDate")}
            isInvalid={!!errors.personalRequestDesiredDate}
            errorMessage={errors.personalRequestDesiredDate}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestEmploymentType"
            label="Personal Request Employment Type"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestEmploymentType || ""}
            selectedKeys={[formData.personalRequestEmploymentType] || ""}
            onChange={handleInputChange("personalRequestEmploymentType")}
            isInvalid={!!errors.personalRequestEmploymentType}
            errorMessage={errors.personalRequestEmploymentType}
          >
            <SelectItem value="FULL_TIME" key="FULL_TIME">
              FULL_TIME
            </SelectItem>
            <SelectItem value="PART_TIME" key="PART_TIME">
              PART_TIME
            </SelectItem>
            <SelectItem value="TEMPORARY" key="TEMPORARY">
              TEMPORARY
            </SelectItem>
            <SelectItem value="CONTRACT" key="CONTRACT">
              CONTRACT
            </SelectItem>
            <SelectItem value="INTERN" key="INTERN">
              INTERN
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestReasonForRequest"
            label="Personal Request Reason For Request"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonForRequest || ""}
            selectedKeys={[formData.personalRequestReasonForRequest] || ""}
            onChange={handleInputChange("personalRequestReasonForRequest")}
            isInvalid={!!errors.personalRequestReasonForRequest}
            errorMessage={errors.personalRequestReasonForRequest}
          >
            <SelectItem value="REPLACE_STAFF" key="REPLACE_STAFF">
              REPLACE_STAFF
            </SelectItem>
            <SelectItem value="NEW_POSITION" key="NEW_POSITION">
              NEW_POSITION
            </SelectItem>
            <SelectItem value="EXPANSION" key="EXPANSION">
              EXPANSION
            </SelectItem>
            <SelectItem value="OTHER" key="OTHER">
              OTHER
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestReasonGender"
            label="Personal Request Gender"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonGender || ""}
            selectedKeys={[formData.personalRequestReasonGender] || ""}
            onChange={handleInputChange("personalRequestReasonGender")}
            isInvalid={!!errors.personalRequestReasonGender}
            errorMessage={errors.personalRequestReasonGender}
          >
            <SelectItem value="Male" key="Male">
              Male
            </SelectItem>
            <SelectItem value="FeMale" key="FeMale">
              FeMale
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestReasonAge"
            type="number"
            label="Personal Request Age"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonAge || ""}
            onChange={handleInputChange("personalRequestReasonAge")}
            isInvalid={!!errors.personalRequestReasonAge}
            errorMessage={errors.personalRequestReasonAge}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestReasonEducation"
            type="text"
            label="Personal Request Education"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonEducation || ""}
            onChange={handleInputChange("personalRequestReasonEducation")}
            isInvalid={!!errors.personalRequestReasonEducation}
            errorMessage={errors.personalRequestReasonEducation}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestReasonEnglishSkill"
            label="Personal Request English Skill"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonEnglishSkill || ""}
            selectedKeys={[formData.personalRequestReasonEnglishSkill] || ""}
            onChange={handleInputChange("personalRequestReasonEnglishSkill")}
            isInvalid={!!errors.personalRequestReasonEnglishSkill}
            errorMessage={errors.personalRequestReasonEnglishSkill}
          >
            <SelectItem value="BASIC" key="BASIC">
              BASIC
            </SelectItem>
            <SelectItem value="INTERMEDIATE" key="INTERMEDIATE">
              INTERMEDIATE
            </SelectItem>
            <SelectItem value="ADVANCED" key="ADVANCED">
              ADVANCED
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="personalRequestReasonComputerSkill"
            label="Personal Request Computer Skill"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonComputerSkill || ""}
            selectedKeys={[formData.personalRequestReasonComputerSkill] || ""}
            onChange={handleInputChange("personalRequestReasonComputerSkill")}
            isInvalid={!!errors.personalRequestReasonComputerSkill}
            errorMessage={errors.personalRequestReasonComputerSkill}
          >
            <SelectItem value="BASIC" key="BASIC">
              BASIC
            </SelectItem>
            <SelectItem value="INTERMEDIATE" key="INTERMEDIATE">
              INTERMEDIATE
            </SelectItem>
            <SelectItem value="ADVANCED" key="ADVANCED">
              ADVANCED
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestReasonOtherSkill"
            type="text"
            label="Personal Request Other Skill"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonOtherSkill || ""}
            onChange={handleInputChange("personalRequestReasonOtherSkill")}
            isInvalid={!!errors.personalRequestReasonOtherSkill}
            errorMessage={errors.personalRequestReasonOtherSkill}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="personalRequestReasonExperience"
            type="text"
            label="Personal Request Experience"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.personalRequestReasonExperience || ""}
            onChange={handleInputChange("personalRequestReasonExperience")}
            isInvalid={!!errors.personalRequestReasonExperience}
            errorMessage={errors.personalRequestReasonExperience}
          />
        </div>
      </div>

      {!isParentOfCreator && !isHRManager && !isMD && isUpdate && (
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Select
              name="personalRequestStatus"
              label="Status"
              placeholder="Please Select Status"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              value={formData.personalRequestStatus || ""}
              selectedKeys={[formData.personalRequestStatus] || ""}
              onChange={handleInputChange("personalRequestStatus")}
              isInvalid={!!errors.personalRequestStatus}
              errorMessage={errors.personalRequestStatus}
            >
              <SelectItem
                value="PendingManagerApprove"
                key="PendingManagerApprove"
              >
                PendingManagerApprove
              </SelectItem>
              <SelectItem value="Cancel" key="Cancel">
                Cancel
              </SelectItem>
            </Select>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="Operated By"
            type="text"
            label="Operated By"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={operatedBy}
            isReadOnly={true}
          />
        </div>
      </div>

      {isParentOfCreator &&
        formData.personalRequestStatus === "PendingManagerApprove" && (
          <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="success"
                startContent={<Database />}
                onPress={onManagerApprove}
                type="button"
              >
                Manager Approved
              </Button>
            </div>
            <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="danger"
                startContent={<Cancel />}
                onPress={onManagerReject}
                type="button"
              >
                Manager Cancel
              </Button>
            </div>
          </div>
        )}

      {isHRManager && formData.personalRequestStatus === "PendingHrApprove" && (
        <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="success"
              startContent={<Database />}
              onPress={onHrApprove}
              type="button"
            >
             Hr Approved
            </Button>
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="danger"
              startContent={<Cancel />}
              onPress={onHrReject}
              type="button"
            >
             Hr Cancel
            </Button>
          </div>
        </div>
      )}

      {isMD && (
        <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="success"
              startContent={<Database />}
              onPress={onMdApprove}
              type="button"
            >
              Md Approved
            </Button>
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="danger"
              startContent={<Cancel />}
              onPress={onMdReject}
              type="button"
            >
             Md Cancel
            </Button>
          </div>
        </div>
      )}
      {!isParentOfCreator && !isHRManager && !isMD && (
        <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="success"
              startContent={<Database />}
              type="submit"
            >
              Submit
            </Button>
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Button
              size="md"
              color="danger"
              startContent={<Cancel />}
              onPress={onClear}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
