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
  filtereddivision,
  filtereddepartment,
  filteredposition,
  filteredparent,
  isbranchselected,
  isBranchAndDivisionSelected,
  isBranchAndDivisionAndDepartmentSelected,
  branch,
  role,
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
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
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
            name="employmentPositionId"
            label="Position Name"
            placeholder="Please Select Position Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentPositionId?.toString() || ""}
            selectedKeys={[formData.employmentPositionId?.toString() || ""]}
            onChange={handleInputChange("employmentPositionId")}
            isDisabled={!isBranchAndDivisionAndDepartmentSelected}
            isInvalid={!!errors.employmentPositionId}
            errorMessage={errors.employmentPositionId}
          >
            {filteredposition.map((position) => (
              <SelectItem key={position.positionId} value={position.positionId}>
                {position.positionName}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employmentRoleId"
            label="Role Name"
            placeholder="Please Select Role Name"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentRoleId?.toString() || ""}
            selectedKeys={[formData.employmentRoleId?.toString() || ""]}
            onChange={handleInputChange("employmentRoleId")}
            isInvalid={!!errors.employmentRoleId}
            errorMessage={errors.employmentRoleId}
          >
            {role.map((role) => (
              <SelectItem key={role.roleId} value={role.roleId}>
                {role.roleName}
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
            type="date"
            name="employmentStartWork"
            label="Start Work"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employmentStartWork || ""}
            onChange={handleInputChange("employmentStartWork")}
            isInvalid={!!errors.employmentStartWork}
            errorMessage={errors.employmentStartWork}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          employmentPicture
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          employmentSignature
        </div>
      </div>
      {formData.employeeCitizen && formData.employeeCitizen !== "Thai" && (
        <>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Select
                name="employmentEnterType"
                label="Employment MOU Type"
                placeholder="Please Select Status"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentEnterType || ""}
                selectedKeys={[formData.employmentEnterType] || ""}
                onChange={handleInputChange("employmentEnterType")}
                isInvalid={!!errors.employmentEnterType}
                errorMessage={errors.employmentEnterType}
              >
                <SelectItem
                  value="MOU นำเข้า บต.30 (ตามกำหนด)"
                  key="MOU นำเข้า บต.30 (ตามกำหนด)"
                >
                  MOU นำเข้า บต.30 (ตามกำหนด)
                </SelectItem>
                <SelectItem
                  value="MOU นำเข้า บต.25 (เกินกำหนด)"
                  key="MOU นำเข้า บต.25 (เกินกำหนด)"
                >
                  MOU นำเข้า บต.25 (เกินกำหนด)
                </SelectItem>
                <SelectItem value="MOU ในไทย" key="MOU ในไทย">
                  MOU ในไทย
                </SelectItem>
                <SelectItem
                  value="50อ1 บัตรชมพู มติครม. 20/8/62"
                  key="50อ1 บัตรชมพู มติครม. 20/8/62"
                >
                  50อ1 บัตรชมพู มติครม. 20/8/62
                </SelectItem>
                <SelectItem
                  value="บต.23 5001 บัตรชมพู มติครม. 4/8/63"
                  key="บต.23 5001 บัตรชมพู มติครม. 4/8/63"
                >
                  บต.23 5001 บัตรชมพู มติครม. 4/8/63
                </SelectItem>
                <SelectItem
                  value="บต.48 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 29/12/63 (Online)"
                  key="บต.48 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 29/12/63 (Online)"
                >
                  บต.48 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 29/12/63 (Online)
                </SelectItem>
                <SelectItem
                  value="บต.50อ3 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 28/9/64 (Online)"
                  key="บต.50อ3 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 28/9/64 (Online)"
                >
                  บต.50อ3 ใบอนุญาตทำงานสีน้ำเงิน มติครม. 28/9/64 (Online)
                </SelectItem>
                <SelectItem value="CI เล่มเขียว" key="CI เล่มเขียว">
                  CI เล่มเขียว
                </SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentPassportNumber"
                type="text"
                label="Passport Number"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentPassportNumber || ""}
                onChange={handleInputChange("employmentPassportNumber")}
                isInvalid={!!errors.employmentPassportNumber}
                errorMessage={errors.employmentPassportNumber}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentPassportStartDate"
                type="date"
                label="Passport Start Date"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentPassportStartDate || ""}
                onChange={handleInputChange("employmentPassportStartDate")}
                isInvalid={!!errors.employmentPassportStartDate}
                errorMessage={errors.employmentPassportStartDate}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentPassportEndDate"
                type="date"
                label="Passport End Date"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentPassportEndDate || ""}
                onChange={handleInputChange("employmentPassportEndDate")}
                isInvalid={!!errors.employmentPassportEndDate}
                errorMessage={errors.employmentPassportEndDate}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentPassportIssuedBy"
                type="text"
                label="Passport Issued By"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentPassportIssuedBy || ""}
                onChange={handleInputChange("employmentPassportIssuedBy")}
                isInvalid={!!errors.employmentPassportIssuedBy}
                errorMessage={errors.employmentPassportIssuedBy}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentPlaceOfBirth"
                type="text"
                label="Place Of Birth"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentPlaceOfBirth || ""}
                onChange={handleInputChange("employmentPlaceOfBirth")}
                isInvalid={!!errors.employmentPlaceOfBirth}
                errorMessage={errors.employmentPlaceOfBirth}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentEnterCheckPoint"
                type="text"
                label="Enter Check Point"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentEnterCheckPoint || ""}
                onChange={handleInputChange("employmentEnterCheckPoint")}
                isInvalid={!!errors.employmentEnterCheckPoint}
                errorMessage={errors.employmentEnterCheckPoint}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentEnterDate"
                type="date"
                label="Enter Date"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentEnterDate || ""}
                onChange={handleInputChange("employmentEnterDate")}
                isInvalid={!!errors.employmentEnterDate}
                errorMessage={errors.employmentEnterDate}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentImmigration"
                type="text"
                label="Immigration"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentImmigration || ""}
                onChange={handleInputChange("employmentImmigration")}
                isInvalid={!!errors.employmentImmigration}
                errorMessage={errors.employmentImmigration}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentTypeOfVisa"
                type="text"
                label="Type Of Visa"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentTypeOfVisa || ""}
                onChange={handleInputChange("employmentTypeOfVisa")}
                isInvalid={!!errors.employmentTypeOfVisa}
                errorMessage={errors.employmentTypeOfVisa}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentVisaNumber"
                type="text"
                label="Visa Number"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentVisaNumber || ""}
                onChange={handleInputChange("employmentVisaNumber")}
                isInvalid={!!errors.employmentVisaNumber}
                errorMessage={errors.employmentVisaNumber}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentVisaIssuedBy"
                type="text"
                label="Visa Issued By"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentVisaIssuedBy || ""}
                onChange={handleInputChange("employmentVisaIssuedBy")}
                isInvalid={!!errors.employmentVisaIssuedBy}
                errorMessage={errors.employmentVisaIssuedBy}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentWorkPermitNumber"
                type="text"
                label="Work Permit Number"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentWorkPermitNumber || ""}
                onChange={handleInputChange("employmentWorkPermitNumber")}
                isInvalid={!!errors.employmentWorkPermitNumber}
                errorMessage={errors.employmentWorkPermitNumber}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentWorkPermitStartDate"
                type="date"
                label="Work Permit Start Date"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentWorkPermitStartDate || ""}
                onChange={handleInputChange("employmentWorkPermitStartDate")}
                isInvalid={!!errors.employmentWorkPermitStartDate}
                errorMessage={errors.employmentWorkPermitStartDate}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentWorkPermitEndDate"
                type="date"
                label="Work Permit End Date"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentWorkPermitEndDate || ""}
                onChange={handleInputChange("employmentWorkPermitEndDate")}
                isInvalid={!!errors.employmentWorkPermitEndDate}
                errorMessage={errors.employmentWorkPermitEndDate}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentWorkPermitIssuedBy"
                type="text"
                label="Work Permit Issued By"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentWorkPermitIssuedBy || ""}
                onChange={handleInputChange("employmentWorkPermitIssuedBy")}
                isInvalid={!!errors.employmentWorkPermitIssuedBy}
                errorMessage={errors.employmentWorkPermitIssuedBy}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentSsoNumber"
                type="text"
                label="Sso Number"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentSsoNumber || ""}
                onChange={handleInputChange("employmentSsoNumber")}
                isInvalid={!!errors.employmentSsoNumber}
                errorMessage={errors.employmentSsoNumber}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="employmentSsoHospital"
                type="text"
                label="Sso Hospital"
                placeholder="Please Enter Data"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentSsoHospital || ""}
                onChange={handleInputChange("employmentSsoHospital")}
                isInvalid={!!errors.employmentSsoHospital}
                errorMessage={errors.employmentSsoHospital}
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Select
                name="employmentWorkStatus"
                label="Work Status"
                placeholder="Please Select Status"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentWorkStatus || ""}
                selectedKeys={[formData.employmentWorkStatus] || ""}
                onChange={handleInputChange("employmentWorkStatus")}
                isInvalid={!!errors.employmentWorkStatus}
                errorMessage={errors.employmentWorkStatus}
              >
                <SelectItem value="CurrentEmployee" key="CurrentEmployee">
                  CurrentEmployee
                </SelectItem>
                <SelectItem value="Resign" key="Resign">
                  Resign
                </SelectItem>
              </Select>
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Select
                name="employmentType"
                label="Employment Type"
                placeholder="Please Select Status"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                value={formData.employmentType || ""}
                selectedKeys={[formData.employmentType] || ""}
                onChange={handleInputChange("employmentType")}
                isInvalid={!!errors.employmentType}
                errorMessage={errors.employmentType}
              >
                <SelectItem value="MONTHLY_SALARY" key="MONTHLY_SALARY">
                  MONTHLY_SALARY
                </SelectItem>
                <SelectItem value="DAILY_WAGE" key="DAILY_WAGE">
                  DAILY_WAGE
                </SelectItem>
                <SelectItem
                  value="MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES"
                  key="MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES"
                >
                  MONTHLY_SALARY_FOR_PERSONS_WITH_DISABILITIES
                </SelectItem>
              </Select>
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
