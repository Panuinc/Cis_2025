"use client";
import React, { useEffect } from "react";
import { Cancel, Database } from "@/components/icons/icons";
import CommonTable from "@/components/CommonTable";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
} from "@nextui-org/react";

export default function FormTraining({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,
  handleSelect,
  isUpdate = false,
  operatedBy = "",
  selectedIds,

  branch,
  employees,
  site,
  division,
  department,
  parent,
  filteredEmployees,

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

  isHRManager,
  isMD,
  onHrApprove,
  onHrReject,
  onMdApprove,
  onMdReject,
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
      ? `${employment.EmploymentParentBy.employeeFirstnameTH} ${employment.EmploymentParentBy.employeeLastnameTH}`
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
        return `${item.employeeFirstnameTH} ${item.employeeLastnameTH}`;
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

  useEffect(() => {
    if (isUpdate) {
      setShowEmployeeSection(true);
    }
  }, [isUpdate, setShowEmployeeSection]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="trainingType"
            label="Training Type"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingType || ""}
            selectedKeys={[formData.trainingType] || []}
            onChange={handleInputChange("trainingType")}
            isInvalid={!!errors.trainingType}
            errorMessage={errors.trainingType}
          >
            <SelectItem
              value="Training_to_prepare_for_work"
              key="Training_to_prepare_for_work"
            >
              Training_to_prepare_for_work
            </SelectItem>
            <SelectItem
              value="Training_to_upgrade_labor_skills"
              key="Training_to_upgrade_labor_skills"
            >
              Training_to_upgrade_labor_skills
            </SelectItem>
            <SelectItem
              value="Training_to_change_career_fields"
              key="Training_to_change_career_fields"
            >
              Training_to_change_career_fields
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingName"
            type="text"
            label="Training Name"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingName || ""}
            onChange={handleInputChange("trainingName")}
            isInvalid={!!errors.trainingName}
            errorMessage={errors.trainingName}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Textarea
            name="trainingObjectives"
            label="Training Objectives"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingObjectives || ""}
            onChange={handleInputChange("trainingObjectives")}
            isInvalid={!!errors.trainingObjectives}
            errorMessage={errors.trainingObjectives}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Textarea
            name="trainingTargetGroup"
            label="Training Target Group"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingTargetGroup || ""}
            onChange={handleInputChange("trainingTargetGroup")}
            isInvalid={!!errors.trainingTargetGroup}
            errorMessage={errors.trainingTargetGroup}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="trainingInstitutionsType"
            label="Training Institutions Type"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingInstitutionsType || ""}
            selectedKeys={[formData.trainingInstitutionsType] || ""}
            onChange={handleInputChange("trainingInstitutionsType")}
            isInvalid={!!errors.trainingInstitutionsType}
            errorMessage={errors.trainingInstitutionsType}
          >
            <SelectItem value="Internal" key="Internal">
              Internal
            </SelectItem>
            <SelectItem value="External" key="External">
              External
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="datetime-local"
            name="trainingStartDate"
            label="Training Start"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingStartDate || ""}
            onChange={handleInputChange("trainingStartDate")}
            isInvalid={!!errors.trainingStartDate}
            errorMessage={errors.trainingStartDate}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="datetime-local"
            name="trainingEndDate"
            label="Training End"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingEndDate}
            onChange={handleInputChange("trainingEndDate")}
            isInvalid={!!errors.trainingEndDate}
            errorMessage={errors.trainingEndDate}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingInstitutions"
            type="text"
            label="Training Institutions"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingInstitutions || ""}
            onChange={handleInputChange("trainingInstitutions")}
            isInvalid={!!errors.trainingInstitutions}
            errorMessage={errors.trainingInstitutions}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingLecturer"
            type="text"
            label="Training Lecturer"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingLecturer || ""}
            onChange={handleInputChange("trainingLecturer")}
            isInvalid={!!errors.trainingLecturer}
            errorMessage={errors.trainingLecturer}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingLocation"
            type="text"
            label="Training Location"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingLocation || ""}
            onChange={handleInputChange("trainingLocation")}
            isInvalid={!!errors.trainingLocation}
            errorMessage={errors.trainingLocation}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingPrice"
            type="number"
            label="Training Price"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingPrice || ""}
            onChange={handleInputChange("trainingPrice")}
            isInvalid={!!errors.trainingPrice}
            errorMessage={errors.trainingPrice}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingEquipmentPrice"
            type="number"
            label="Equipment Price"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingEquipmentPrice || ""}
            onChange={handleInputChange("trainingEquipmentPrice")}
            isInvalid={!!errors.trainingEquipmentPrice}
            errorMessage={errors.trainingEquipmentPrice}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingFoodPrice"
            type="number"
            label="Food Price"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingFoodPrice || ""}
            onChange={handleInputChange("trainingFoodPrice")}
            isInvalid={!!errors.trainingFoodPrice}
            errorMessage={errors.trainingFoodPrice}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingFarePrice"
            type="number"
            label="Fare Price"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingFarePrice || ""}
            onChange={handleInputChange("trainingFarePrice")}
            isInvalid={!!errors.trainingFarePrice}
            errorMessage={errors.trainingFarePrice}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingOtherExpenses"
            type="text"
            label="Other Expenses"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingOtherExpenses || ""}
            onChange={handleInputChange("trainingOtherExpenses")}
            isInvalid={!!errors.trainingOtherExpenses}
            errorMessage={errors.trainingOtherExpenses}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingOtherPrice"
            type="number"
            label="Other Price"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingOtherPrice || ""}
            onChange={handleInputChange("trainingOtherPrice")}
            isInvalid={!!errors.trainingOtherPrice}
            errorMessage={errors.trainingOtherPrice}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingSumPrice"
            type="number"
            label="Training Sum Price"
            placeholder="Auto Calculate"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingSumPrice || ""}
            onChange={handleInputChange("trainingSumPrice")}
            isInvalid={!!errors.trainingSumPrice}
            errorMessage={errors.trainingSumPrice}
            isReadOnly={true}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingReferenceDocument"
            type="text"
            label="Reference Document"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingReferenceDocument || ""}
            onChange={handleInputChange("trainingReferenceDocument")}
            isInvalid={!!errors.trainingReferenceDocument}
            errorMessage={errors.trainingReferenceDocument}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingRemark"
            type="text"
            label="Training Remark"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingRemark || ""}
            onChange={handleInputChange("trainingRemark")}
            isInvalid={!!errors.trainingRemark}
            errorMessage={errors.trainingRemark}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="trainingRequireKnowledge"
            label="Require Knowledge?"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            selectedKeys={[formData.trainingRequireKnowledge] || ""}
            onChange={handleInputChange("trainingRequireKnowledge")}
            isInvalid={!!errors.trainingRequireKnowledge}
            errorMessage={errors.trainingRequireKnowledge}
          >
            <SelectItem value="Yes" key="Yes">
              Yes
            </SelectItem>
            <SelectItem value="No" key="No">
              No
            </SelectItem>
          </Select>
        </div>
      </div>

      {isUpdate && (
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Select
              name="trainingStatus"
              label="Status"
              placeholder="Please Select Status"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              selectedKeys={[formData.trainingStatus] || ""}
              onChange={handleInputChange("trainingStatus")}
              isInvalid={!!errors.trainingStatus}
              errorMessage={errors.trainingStatus}
            >
              <SelectItem value="PendingHrApprove" key="PendingHrApprove">
                PendingHrApprove
              </SelectItem>
              <SelectItem value="Cancel" key="Cancel">
                Cancel
              </SelectItem>
            </Select>
          </div>
        </div>
      )}

      {!isUpdate && !showEmployeeSection && (
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="success"
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
              color={sequentialMode ? "warning" : "success"}
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
                  selectedKeys={[filterBranch] || []}
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <SelectItem value="">All Branches</SelectItem>
                  {branch.map((b) => (
                    <SelectItem key={b.branchId} value={b.branchId.toString()}>
                      {b.branchName}
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
                  selectedKeys={[filterSite] || []}
                  onChange={(e) => setFilterSite(e.target.value)}
                  isDisabled={sequentialMode ? !filterBranch : false}
                >
                  <SelectItem value="">All Sites</SelectItem>
                  {site
                    .filter((s) =>
                      sequentialMode && filterBranch
                        ? s.siteBranchId === Number(filterBranch)
                        : true
                    )
                    .map((s) => (
                      <SelectItem key={s.siteId} value={s.siteId.toString()}>
                        {s.siteName}
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
                  selectedKeys={[filterDivision] || []}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  isDisabled={sequentialMode ? !filterBranch : false}
                >
                  <SelectItem value="">All Divisions</SelectItem>
                  {division
                    .filter((d) =>
                      sequentialMode && filterBranch
                        ? d.divisionBranchId === Number(filterBranch)
                        : true
                    )
                    .map((d) => (
                      <SelectItem
                        key={d.divisionId}
                        value={d.divisionId.toString()}
                      >
                        {d.divisionName}
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
                  selectedKeys={[filterDepartment] || []}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  isDisabled={sequentialMode ? !filterDivision : false}
                >
                  <SelectItem value="">All Departments</SelectItem>
                  {department
                    .filter((dept) =>
                      sequentialMode && filterDivision
                        ? dept.departmentBranchId === Number(filterBranch) &&
                          dept.departmentDivisionId === Number(filterDivision)
                        : true
                    )
                    .map((dept) => (
                      <SelectItem
                        key={dept.departmentId}
                        value={dept.departmentId.toString()}
                      >
                        {dept.departmentName}
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
                  selectedKeys={[filterParent] || []}
                  onChange={(e) => setFilterParent(e.target.value)}
                  isDisabled={sequentialMode ? !filterDivision : false}
                >
                  <SelectItem value="">All Parents</SelectItem>
                  {parent
                    .filter((p) =>
                      sequentialMode && filterDivision
                        ? p.employeeEmployment?.some(
                            (emp) =>
                              emp.employmentBranchId === Number(filterBranch) &&
                              emp.employmentDivisionId ===
                                Number(filterDivision)
                          )
                        : true
                    )
                    .map((p) => (
                      <SelectItem
                        key={p.employeeId}
                        value={p.employeeId.toString()}
                      >
                        {`${p.employeeFirstnameTH} ${p.employeeLastnameTH}`}
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
                    Selected Employee
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

      {isHRManager && (
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
      {!isHRManager && !isMD && (
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
