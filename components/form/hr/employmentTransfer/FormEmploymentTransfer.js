"use client";
import React from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";
import CommonTable from "@/components/CommonTable";

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
  const columns = [
    { name: "Select", uid: "select" },
    { name: "ID", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Branch", uid: "branch" },
    { name: "Site", uid: "site" },
    { name: "Division", uid: "division" },
    { name: "Department", uid: "department" },
    { name: "Parent Name", uid: "parentName" },
    { name: "Status", uid: "status" },
  ];

  const renderCell = (item, columnKey) => {
    const employment = item.employeeEmployment?.[0] || {};
    const parentName = employment.EmploymentParentBy
      ? `${employment.EmploymentParentBy.employeeFirstname} ${employment.EmploymentParentBy.employeeLastname}`
      : "-";

    switch (columnKey) {
      case "select":
        return (
          <input
            type="checkbox"
            checked={selectedIds.includes(item.employeeId)}
            onChange={(e) => handleSelect(e.target.checked, item.employeeId)}
          />
        );
      case "id":
        return item.employeeId;
      case "name":
        return `${item.employeeFirstname} ${item.employeeLastname}`;
      case "branch":
        return employment.EmploymentBranchId?.branchName || "-";
      case "site":
        return employment.EmploymentSiteId?.siteName || "-";
      case "division":
        return employment.EmploymentDivisionId?.divisionName || "-";
      case "department":
        return employment.EmploymentDepartmentId?.departmentName || "-";
      case "parentName":
        return parentName;
      case "status":
        return item.employeeStatus;
      default:
        return "";
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex flex-col items-start justify-start w-full min-h-96 p-2 gap-2 border-2 border-dark border-dashed overflow-auto">
        <CommonTable
          columns={columns}
          items={employees.map((emp, index) => ({
            ...emp,
            _index: emp.employeeId || index,
          }))}
          loading={false}
          renderCell={renderCell}
          page={1}
          pages={1}
          onPageChange={() => {}}
          rowsPerPage={employees.length}
          onRowsPerPageChange={() => {}}
          emptyContentText="No employees found"
        />
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
