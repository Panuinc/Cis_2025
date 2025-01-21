"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormEmploymentTransfer({
  formRef,
  onSubmit,
  onClear,
  handleSelect,
  handleInputChange,
  errors,
  formData,
  selectedIds,
  branch,
  employees,
  filteredsite,
  filtereddivision,
  filtereddepartment,
  filteredparent,
  isbranchselected,
  isBranchAndDivisionSelected,
  operatedBy,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex items-start justify-start w-full min-h-80 p-2 gap-2 border-2 border-dark border-dashed overflow-auto">
        <table className="table-auto w-full h-full p-2 gap-2">
          <thead className="bg-gray-100 p-2 gap-2">
            <tr>
              <th className="border-b-2 p-4">Select</th>
              <th className="border-b-2 p-4">ID</th>
              <th className="border-b-2 p-4">Name</th>
              <th className="border-b-2 p-4">Branch</th>
              <th className="border-b-2 p-4">Site</th>
              <th className="border-b-2 p-4">Division</th>
              <th className="border-b-2 p-4">Department</th>
              <th className="border-b-2 p-4">Parent Name</th>
              <th className="border-b-2 p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const empId = emp.employeeId;
              const employment = emp.employeeEmployment?.[0] || {};
              const parentName = employment.EmploymentParentBy
                ? `${employment.EmploymentParentBy.employeeFirstname} ${employment.EmploymentParentBy.employeeLastname}`
                : "-";
              return (
                <tr key={empId} className="border">
                  <td className="border-b-2 p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(empId)}
                      onChange={(e) => handleSelect(e.target.checked, empId)}
                    />
                  </td>
                  <td className="border-b-2 p-4">{empId}</td>
                  <td className="border-b-2 p-4">
                    {emp.employeeFirstname} {emp.employeeLastname}
                  </td>
                  <td className="border-b-2 p-4">
                    {employment.EmploymentBranchId?.branchName || "-"}
                  </td>
                  <td className="border-b-2 p-4">
                    {employment.EmploymentSiteId?.siteName || "-"}
                  </td>
                  <td className="border-b-2 p-4">
                    {employment.EmploymentDivisionId?.divisionName || "-"}
                  </td>
                  <td className="border-b-2 p-4">
                    {employment.EmploymentDepartmentId?.departmentName || "-"}
                  </td>
                  <td className="border-b-2 p-4">{parentName}</td>
                  <td className="border-b-2 p-4">{emp.employeeStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
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
