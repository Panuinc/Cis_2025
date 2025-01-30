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

export default function FormTrainingResult({
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
          Table
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingPreTest"
            type="text"
            label="Training Pre Test"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingPreTest || ""}
            onChange={handleInputChange("trainingPreTest")}
            isInvalid={!!errors.trainingPreTest}
            errorMessage={errors.trainingPreTest}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingPostTest"
            type="text"
            label="Training Post Test"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingPostTest || ""}
            onChange={handleInputChange("trainingPostTest")}
            isInvalid={!!errors.trainingPostTest}
            errorMessage={errors.trainingPostTest}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="trainingPictureLink"
            type="text"
            label="Training Picture Link"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.trainingPictureLink || ""}
            onChange={handleInputChange("trainingPictureLink")}
            isInvalid={!!errors.trainingPictureLink}
            errorMessage={errors.trainingPictureLink}
          />
        </div>
      </div>

      {!isUpdate && !showEmployeeSection && (
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
