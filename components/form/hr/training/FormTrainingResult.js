"use client";
import React, { useEffect, useState } from "react";
import { Cancel, Database } from "@/components/icons/icons";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  Switch,
  Pagination,
} from "@nextui-org/react";
import toast from "react-hot-toast";

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

  // รับ props การแบ่งหน้า
  page,
  pages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,

  // รับรายการที่ถูกแบ่งหน้าแล้ว
  paginatedTrainingEmployees,
  totalPages,
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
    { name: "Employment Card Number", uid: "employmentCardNumber" },
    { name: "Result", uid: "result" },
    { name: "Certificate Link", uid: "certificateLink" },
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
            isSelected={selectedIds.includes(item.trainingEmployeeId)}
            onChange={(e) =>
              handleSelect(e.target.checked, item.trainingEmployeeId)
            }
          />
        );
      case "id":
        return item.trainingEmployeeId;
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
      case "employmentCardNumber":
        return employment.employmentCardNumber || "-";
      case "result": {
        const trainingEmployee = item.trainingEmployee || {};
        return (
          <Switch
            isSelected={trainingEmployee.trainingEmployeeResult === "Pass"}
            onChange={(e) => {
              const newResult = e.target.checked ? "Pass" : "Not_Pass";
              handleTrainingEmployeeResultChange(
                item.trainingEmployeeId,
                newResult
              );
            }}
          />
        );
      }
      case "certificateLink": {
        const trainingEmployee = item.trainingEmployee || {};
        if (trainingEmployee.trainingEmployeeResult === "Pass") {
          return (
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                handleTrainingEmployeeCertificateChange(
                  item.trainingEmployeeId,
                  e.target.files[0]
                )
              }
            />
          );
        }
        return "-";
      }
      default:
        return "";
    }
  };

  // Handlers สำหรับ trainingEmployeeResult และ trainingEmployeeCertificateLink
  const handleTrainingEmployeeResultChange = (
    trainingEmployeeId,
    newResult
  ) => {
    const updatedTrainingEmployee = formData.trainingEmployee.map((emp) => {
      if (emp.trainingEmployeeId === trainingEmployeeId) {
        return { ...emp, trainingEmployeeResult: newResult };
      }
      return emp;
    });
    setFormData((prev) => ({
      ...prev,
      trainingEmployee: updatedTrainingEmployee,
    }));
  };

  const handleTrainingEmployeeCertificateChange = async (
    trainingEmployeeId,
    file
  ) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/hr/training/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "secret-token": SECRET_TOKEN,
        },
      });

      const jsonData = await res.json();

      if (res.ok) {
        const url = jsonData.url;
        const updatedTrainingEmployee = formData.trainingEmployee.map((emp) => {
          if (emp.trainingEmployeeId === trainingEmployeeId) {
            return { ...emp, trainingEmployeeCertificateLink: url };
          }
          return emp;
        });
        setFormData((prev) => ({
          ...prev,
          trainingEmployee: updatedTrainingEmployee,
        }));
        toast.success("Certificate uploaded successfully");
      } else {
        toast.error(jsonData.error || "Error uploading certificate");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed");
    }
  };

  const uploadFile = async (file) => {
    // Implement การอัพโหลดไฟล์ของคุณที่นี่ (เช่น อัพโหลดไปยัง S3, Cloudinary, ฯลฯ)
    // คืน URL ของไฟล์ที่อัพโหลด
    // สำหรับตัวอย่างนี้ คืน URL แบบสมมติหลังจากหน่วงเวลา
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("https://example.com/path/to/uploaded/file.pdf");
      }, 1000);
    });
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
      {showEmployeeSection && (
        <div className="w-full p-2 border-2 border-dark border-dashed">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.uid}
                    className="px-4 py-2 border border-gray-300 bg-gray-200 text-left"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTrainingEmployees.length > 0 ? (
                paginatedTrainingEmployees.map((item) => (
                  <tr key={item.trainingEmployeeId}>
                    {columns.map((column) => (
                      <td
                        key={column.uid}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {renderCell(item, column.uid)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* การแบ่งหน้า */}
        </div>
      )}

      {/* ฟิลด์ฟอร์มที่มีอยู่สำหรับ trainingPreTest, trainingPostTest, trainingPictureLink */}
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
            type="file"
            label="Training Picture Link"
            placeholder="Please Upload Picture"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch(`/api/hr/training/upload`, {
                    method: "POST",
                    body: formData,
                    headers: {
                      "secret-token": SECRET_TOKEN,
                    },
                  });

                  const jsonData = await res.json();

                  if (res.ok) {
                    const url = jsonData.url;
                    setFormData((prev) => ({
                      ...prev,
                      trainingPictureLink: url,
                    }));
                    toast.success("Picture uploaded successfully");
                  } else {
                    toast.error(jsonData.error || "Error uploading picture");
                  }
                } catch (error) {
                  console.error("File upload failed:", error);
                  toast.error("File upload failed");
                }
              }
            }}
            isInvalid={!!errors.trainingPictureLink}
            errorMessage={errors.trainingPictureLink}
          />
        </div>
      </div>

      {/* Operated By */}
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

      {/* ปุ่ม Submit และ Cancel */}
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
