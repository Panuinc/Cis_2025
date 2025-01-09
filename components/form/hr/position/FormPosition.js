"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormPosition({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  filtereddivision,
  isbranchselected,
  filtereddepartment,
  isbranchanddivisionselected,
  branch,
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="positionBranchId"
            label="Branch Name"
            placeholder="Please Select Branch Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.positionBranchId?.toString() || ""}
            selectedKeys={[formData.positionBranchId?.toString() || ""]}
            onChange={handleInputChange("positionBranchId")}
            isDisabled={isUpdate}
            isInvalid={!!errors.positionBranchId}
            errorMessage={errors.positionBranchId}
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
            name="positionDivisionId"
            label="Division Name"
            placeholder="Please Select Division Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.positionDivisionId?.toString() || ""}
            selectedKeys={[formData.positionDivisionId?.toString() || ""]}
            onChange={handleInputChange("positionDivisionId")}
            isDisabled={isUpdate || !isbranchselected}
            isInvalid={!!errors.positionDivisionId}
            errorMessage={errors.positionDivisionId}
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
            name="positionDepartmentId"
            label="Department Name"
            placeholder="Please Select Department Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.positionDepartmentId?.toString() || ""}
            selectedKeys={[formData.positionDepartmentId?.toString() || ""]}
            onChange={handleInputChange("positionDepartmentId")}
            isDisabled={isUpdate || !isbranchanddivisionselected}
            isInvalid={!!errors.positionDepartmentId}
            errorMessage={errors.positionDepartmentId}
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
          <Input
            name="positionName"
            type="text"
            label="Position Name"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.positionName || ""}
            onChange={handleInputChange("positionName")}
            isInvalid={!!errors.positionName}
            errorMessage={errors.positionName}
          />
        </div>
      </div>
      {isUpdate && (
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Select
              name="positionStatus"
              label="Status"
              placeholder="Please Select Status"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              value={formData.positionStatus || ""}
              selectedKeys={[formData.positionStatus] || ""}
              onChange={handleInputChange("positionStatus")}
              isInvalid={!!errors.positionStatus}
              errorMessage={errors.positionStatus}
            >
              <SelectItem value="InActive" key="InActive">
                InActive
              </SelectItem>
              <SelectItem value="Active" key="Active">
                Active
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
    </form>
  );
}
