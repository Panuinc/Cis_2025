"use client";
import React from "react";
import { Cancel, Database } from "@/components/icons/icons";
import { Table, Button, Select, SelectItem } from "@nextui-org/react";

export default function FormEmploymentTransfer({
  // Refs
  formRef,

  // Handlers
  onSubmit,
  onClear,
  handleSelect,

  // States
  errors,
  setErrors,
  formData,
  setFormData,
  selectedIds,

  // Derived data
  filteredsite,
  filtereddivision,
  filtereddepartment,
  filteredparent,
  branch,
  employees,

  // Booleans
  isbranchselected,
  isBranchAndDivisionSelected,
  isUpdate,

  // Misc
  operatedBy,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <table className="mb-4 border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Select</th>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const empId = emp.employeeId;
            return (
              <tr key={empId} className="border">
                <td className="border p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(empId)}
                    onChange={(e) => handleSelect(e.target.checked, empId)}
                  />
                </td>
                <td className="border p-2">{empId}</td>
                <td className="border p-2">
                  {emp.employeeFirstname} {emp.employeeLastname}
                </td>
                <td className="border p-2">{emp.employeeStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
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
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employmentDivisionId"
            label="Division Name"
            placeholder="Please Select Division Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentDivisionId?.toString() || ""}
            selectedKeys={[formData.employmentDivisionId?.toString() || ""]}
            onChange={handleInputChange("employmentDivisionId")}
            isDisabled={!isbranchselected}
            isInvalid={!!errors.employmentDivisionId}
            errorMessage={errors.employmentDivisionId}
          >
            {filtereddivision.map((division) => (
              <SelectItem key={division.divisionId} value={division.divisionId}>
                {division.divisionName}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employmentDepartmentId"
            label="Department Name"
            placeholder="Please Select Department Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentDepartmentId?.toString() || ""}
            selectedKeys={[formData.employmentDepartmentId?.toString() || ""]}
            onChange={handleInputChange("employmentDepartmentId")}
            isDisabled={!isBranchAndDivisionSelected}
            isInvalid={!!errors.employmentDepartmentId}
            errorMessage={errors.employmentDepartmentId}
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
            name="employmentParentId"
            label="Parent Name"
            placeholder="Please Select Parent Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentParentId?.toString() || ""}
            selectedKeys={[formData.employmentParentId?.toString() || ""]}
            onChange={handleInputChange("employmentParentId")}
            isDisabled={!isBranchAndDivisionSelected}
            isInvalid={!!errors.employmentParentId}
            errorMessage={errors.employmentParentId}
          >
            {filteredparent.map((parent) => (
              <SelectItem key={parent.employeeId} value={parent.employeeId}>
                {`${parent.employeeFirstname} ${parent.employeeLastname}`}
              </SelectItem>
            ))}
          </Select>
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
