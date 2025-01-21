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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employment Transfer</h1>

      {/* -- ตารางแสดง Employees ให้เลือก -- */}
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

      {/* -- เลือก Branch, Site, Division, Department, Parent -- */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Branch"
          placeholder="Select Branch"
          selectedKeys={[formData.employmentBranchId]}
          onChange={(keys) => {
            const value = keys.anchorKey || "";
            setFormData((prev) => ({ ...prev, employmentBranchId: value }));
          }}
        >
          {branch.map((b) => (
            <SelectItem key={String(b.branchId)} value={String(b.branchId)}>
              {b.branchName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Site"
          placeholder="Select Site"
          selectedKeys={[formData.employmentSiteId]}
          onChange={(keys) => {
            const value = keys.anchorKey || "";
            setFormData((prev) => ({ ...prev, employmentSiteId: value }));
          }}
        >
          {filteredsite.map((s) => (
            <SelectItem key={String(s.siteId)} value={String(s.siteId)}>
              {s.siteName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Division"
          placeholder="Select Division"
          selectedKeys={[formData.employmentDivisionId]}
          onChange={(keys) => {
            const value = keys.anchorKey || "";
            setFormData((prev) => ({ ...prev, employmentDivisionId: value }));
          }}
        >
          {filtereddivision.map((d) => (
            <SelectItem key={String(d.divisionId)} value={String(d.divisionId)}>
              {d.divisionName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Department"
          placeholder="Select Department"
          selectedKeys={[formData.employmentDepartmentId]}
          onChange={(keys) => {
            const value = keys.anchorKey || "";
            setFormData((prev) => ({
              ...prev,
              employmentDepartmentId: value,
            }));
          }}
        >
          {filtereddepartment.map((dep) => (
            <SelectItem
              key={String(dep.departmentId)}
              value={String(dep.departmentId)}
            >
              {dep.departmentName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Manager/Parent"
          placeholder="Select Parent"
          selectedKeys={[formData.employmentParentId]}
          onChange={(keys) => {
            const value = keys.anchorKey || "";
            setFormData((prev) => ({
              ...prev,
              employmentParentId: value,
            }));
          }}
        >
          {filteredparent.map((m) => (
            <SelectItem
              key={String(m.employeeId)}
              value={String(m.employeeId)}
            >
              {m.employeeFirstname} {m.employeeLastname}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* ปุ่ม Submit และ Clear */}
      <div className="flex items-center gap-2">
        <Button color="primary" onPress={onSubmit}>
          Transfer Selected
        </Button>
        <Button color="secondary" onPress={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
