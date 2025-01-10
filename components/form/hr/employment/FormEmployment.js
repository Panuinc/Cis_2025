"use client";
import React from "react";
import { Cancel, Database } from "@/components/icons/icons";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";

export default function FormEmployment({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  filteredsite,
  // filtereddivision,
  // filtereddepartment,
  // filteredposition,
  // filteredparent,
  isbranchselected,
  // isbranchanddivisionselected,
  // isbranchanddivisionanddepartmentselected,
  branch,
  // role,
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
          <Input
            type="text"
            name="employmentId"
            label="Employment Id"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentId || ""}
            onChange={handleInputChange("employmentId")}
            isInvalid={!!errors.employmentId}
            errorMessage={errors.employmentId}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            name="employmentNumber"
            label="Employment Number"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentNumber || ""}
            onChange={handleInputChange("employmentNumber")}
            isInvalid={!!errors.employmentNumber}
            errorMessage={errors.employmentNumber}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            name="employmentCardNumber"
            label="Employment Card Number"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentCardNumber || ""}
            onChange={handleInputChange("employmentCardNumber")}
            isInvalid={!!errors.employmentCardNumber}
            errorMessage={errors.employmentCardNumber}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employmentType"
            label="Employment Type"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentType || ""}
            selectedKeys={[formData.employmentType] || ""}
            onChange={handleInputChange("employmentType")}
            isInvalid={!!errors.employmentType}
            errorMessage={errors.employmentType}
          >
            <SelectItem value="DAILY_WAGE" key="DAILY_WAGE">
              DAILY_WAGE
            </SelectItem>
            <SelectItem value="MONTHLY_SALARY" key="MONTHLY_SALARY">
              MONTHLY_SALARY
            </SelectItem>
            <SelectItem
              value="MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES"
              key="MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES"
            >
              MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employmentBranchId"
            label="Branch Name"
            placeholder="Please Select Branch Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentBranchId?.toString() || ""}
            selectedKeys={[formData.employmentBranchId?.toString() || ""]}
            onChange={handleInputChange("employmentBranchId")}
            isInvalid={!!errors.employmentBranchId}
            errorMessage={errors.employmentBranchId}
          >
            {branch.map((branch) => (
              <SelectItem key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Select
            name="employmentSiteId"
            label="Site Name"
            placeholder="Please Select Site Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentSiteId?.toString() || ""}
            selectedKeys={[formData.employmentSiteId?.toString() || ""]}
            onChange={handleInputChange("employmentSiteId")}
            isDisabled={!isbranchselected}
            isInvalid={!!errors.employmentSiteId}
            errorMessage={errors.employmentSiteId}
          >
            {filteredsite.map((site) => (
              <SelectItem key={site.siteId} value={site.siteId}>
                {site.siteName}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          01
        </div>
      </div>
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
