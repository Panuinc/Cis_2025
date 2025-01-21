"use client";

import { Table, Button, Select, SelectItem } from "@nextui-org/react";

// หรือนำเข้า tailwind หรือ library อื่น ๆ ตามเดิม
// import "..."  

export default function FormEmploymentTransfer({
  employees,
  selectedIds,
  handleSelect,

  transferData,
  handleTransferChange,
  handleSubmit,

  activeBranch,
  activeSite,
  activeDivision,
  activeDepartment,
  activeManagers,
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employment Transfer</h1>

      {/* -- ตารางแสดง employees -- */}
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

      {/* -- ฟอร์มเลือก Branch, Site, Division, Department, Parent -- */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Branch"
          placeholder="Select Branch"
          selectedKeys={[transferData.branchId]}
          onChange={handleTransferChange("branchId")}
        >
          {activeBranch.map((b) => (
            <SelectItem key={b.branchId} value={String(b.branchId)}>
              {b.branchName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Site"
          placeholder="Select Site"
          selectedKeys={[transferData.siteId]}
          onChange={handleTransferChange("siteId")}
        >
          {activeSite.map((s) => (
            <SelectItem key={s.siteId} value={String(s.siteId)}>
              {s.siteName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Division"
          placeholder="Select Division"
          selectedKeys={[transferData.divisionId]}
          onChange={handleTransferChange("divisionId")}
        >
          {activeDivision.map((d) => (
            <SelectItem key={d.divisionId} value={String(d.divisionId)}>
              {d.divisionName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Department"
          placeholder="Select Department"
          selectedKeys={[transferData.departmentId]}
          onChange={handleTransferChange("departmentId")}
        >
          {activeDepartment.map((dep) => (
            <SelectItem key={dep.departmentId} value={String(dep.departmentId)}>
              {dep.departmentName}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Manager/Parent"
          placeholder="Select Parent"
          selectedKeys={[transferData.parentId]}
          onChange={handleTransferChange("parentId")}
        >
          {activeManagers.map((m) => (
            <SelectItem key={m.employeeId} value={String(m.employeeId)}>
              {m.employeeFirstname} {m.employeeLastname}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* -- ปุ่ม Submit -- */}
      <Button color="primary" onPress={handleSubmit}>
        Transfer Selected
      </Button>
    </div>
  );
}
