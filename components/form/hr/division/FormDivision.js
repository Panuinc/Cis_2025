"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormDivision({
  formRef,
  onSubmit,
  onClear,
  errors = {},
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
            name="divisionBranchId"
            label="Branch Name"
            placeholder="Please Select Branch Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.divisionBranchId?.toString() || ""}
            selectedKeys={[formData.divisionBranchId?.toString() || ""]}
            onChange={handleInputChange("divisionBranchId")}
            isDisabled={isUpdate}
            isInvalid={!!errors.divisionBranchId}
            errorMessage={errors.divisionBranchId}
          >
            {branch.map((branch) => (
              <SelectItem key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="divisionName"
            type="text"
            label="Division Name"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.divisionName || ""}
            onChange={handleInputChange("divisionName")}
            isInvalid={!!errors.divisionName}
            errorMessage={errors.divisionName}
          />
        </div>
      </div>
      {isUpdate && (
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Select
              name="divisionStatus"
              label="Status"
              placeholder="Please Select Status"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              value={formData.divisionStatus || ""}
              selectedKeys={[formData.divisionStatus] || ""}
              onChange={handleInputChange("divisionStatus")}
              isInvalid={!!errors.divisionStatus}
              errorMessage={errors.divisionStatus}
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
