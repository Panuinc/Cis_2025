"use client";
import React from "react";
import { Input, Button, Select, SelectItem, Checkbox } from "@nextui-org/react";
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

  site,
  division,
  department,
  parent,
  filteredEmployees,

  filteredsite,
  filtereddivision,
  filtereddepartment,
  filteredparent,
  isbranchselected,
  isBranchAndDivisionSelected,
  operatedBy,

  filterBranch,
  setFilterBranch,
  filterSite,
  setFilterSite,
  filterDivision,
  setFilterDivision,
  filterDepartment,
  setFilterDepartment,
  filterParent,
  setFilterParent,
  sequentialMode,
  setSequentialMode,
  showEmployeeSection,
  setShowEmployeeSection,
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
  ];

  const renderCell = (item, columnKey) => {
    const employment = item.employeeEmployment?.[0] || {};
    const parentName = employment.EmploymentParentBy
      ? `${employment.EmploymentParentBy.employeeFirstname} ${employment.EmploymentParentBy.employeeLastname}`
      : "-";

    switch (columnKey) {
      case "select":
        return (
          <Checkbox
            size="lg"
            color="warning"
            isSelected={selectedIds.includes(item.employeeId)}
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
      {!showEmployeeSection && (
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="primary"
            onPress={() => setShowEmployeeSection(true)}
          >
            Select Employee
          </Button>
        </div>
      )}
      {showEmployeeSection && (
        <>
          <div className="flex justify-end w-full p-2">
            <Button
              size="md"
              color={sequentialMode ? "warning" : "primary"}
              onPress={() => setSequentialMode((prev) => !prev)}
            >
              {sequentialMode
                ? "Close Sequential Mode"
                : "Open Sequential Mode"}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Select
                  label="Filter Branch"
                  placeholder="Select Branch"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <SelectItem value="">All Branches</SelectItem>
                  {branch.map((branch) => (
                    <SelectItem
                      key={branch.branchId}
                      value={branch.branchId.toString()}
                    >
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Select
                  label="Filter Site"
                  placeholder="Select Site"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={filterSite}
                  onChange={(e) => setFilterSite(e.target.value)}
                  isDisabled={sequentialMode ? !filterBranch : false}
                >
                  <SelectItem value="">All Sites</SelectItem>
                  {site
                    .filter((site) => {
                      return sequentialMode && filterBranch
                        ? site.siteBranchId === Number(filterBranch)
                        : true;
                    })
                    .map((site) => (
                      <SelectItem
                        key={site.siteId}
                        value={site.siteId.toString()}
                      >
                        {site.siteName}
                      </SelectItem>
                    ))}
                </Select>
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Select
                  label="Filter Division"
                  placeholder="Select Division"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  isDisabled={sequentialMode ? !filterBranch : false}
                >
                  <SelectItem value="">All Divisions</SelectItem>
                  {division
                    .filter((division) => {
                      return sequentialMode && filterBranch
                        ? division.divisionBranchId === Number(filterBranch)
                        : true;
                    })
                    .map((division) => (
                      <SelectItem
                        key={division.divisionId}
                        value={division.divisionId.toString()}
                      >
                        {division.divisionName}
                      </SelectItem>
                    ))}
                </Select>
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Select
                  label="Filter Department"
                  placeholder="Select Department"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  isDisabled={sequentialMode ? !filterDivision : false}
                >
                  <SelectItem value="">All Departments</SelectItem>
                  {department
                    .filter((department) => {
                      return sequentialMode && filterDivision
                        ? department.departmentBranchId ===
                            Number(filterBranch) &&
                            department.departmentDivisionId ===
                              Number(filterDivision)
                        : true;
                    })
                    .map((department) => (
                      <SelectItem
                        key={department.departmentId}
                        value={department.departmentId.toString()}
                      >
                        {department.departmentName}
                      </SelectItem>
                    ))}
                </Select>
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Select
                  label="Filter Parent"
                  placeholder="Select Parent"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={filterParent}
                  onChange={(e) => setFilterParent(e.target.value)}
                  isDisabled={sequentialMode ? !filterDivision : false}
                >
                  <SelectItem value="">All Parents</SelectItem>
                  {parent
                    .filter((parent) => {
                      return sequentialMode && filterDivision
                        ? parent.employeeStatus === "Active" &&
                            parent.employeeEmployment?.some(
                              (emp) =>
                                emp.employmentBranchId ===
                                  Number(filterBranch) &&
                                emp.employmentDivisionId ===
                                  Number(filterDivision)
                            )
                        : true;
                    })
                    .map((parent) => (
                      <SelectItem
                        key={parent.employeeId}
                        value={parent.employeeId.toString()}
                      >
                        {`${parent.employeeFirstname} ${parent.employeeLastname}`}
                      </SelectItem>
                    ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-start justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div
                className={`flex flex-col items-start justify-center w-full p-2 gap-2 border-2 border-dark border-dashed ${
                  selectedIds.length > 0 ? "xl:w-1/2" : ""
                }`}
              >
                <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
                  All Employee
                </div>
                <CommonTable
                  columns={columns}
                  items={filteredEmployees
                    .filter((emp) => !selectedIds.includes(emp.employeeId))
                    .map((emp, index) => ({
                      ...emp,
                      _index: emp.employeeId || index,
                    }))}
                  loading={false}
                  renderCell={renderCell}
                  page={1}
                  pages={1}
                  onPageChange={() => {}}
                  rowsPerPage={filteredEmployees.length}
                  onRowsPerPageChange={() => {}}
                  emptyContentText="No employees found"
                />
              </div>

              {selectedIds.length > 0 && (
                <div className="flex flex-col items-start justify-center w-full xl:w-1/2 p-2 gap-2 border-2 border-dark border-dashed">
                  <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
                    Select Employee
                  </div>
                  <CommonTable
                    columns={columns}
                    items={employees
                      .filter((emp) => selectedIds.includes(emp.employeeId))
                      .map((emp, index) => ({
                        ...emp,
                        _index: emp.employeeId || index,
                      }))}
                    loading={false}
                    renderCell={renderCell}
                    page={1}
                    pages={1}
                    onPageChange={() => {}}
                    rowsPerPage={selectedIds.length}
                    onRowsPerPageChange={() => {}}
                    emptyContentText="No selected employees"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
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
