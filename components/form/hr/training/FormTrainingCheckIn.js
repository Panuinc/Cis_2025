"use client";
import React from "react";
import { Input, Button } from "@nextui-org/react";

export default function FormTrainingCheckIn({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",
  handleTrainingEmployeeCheckInMorningCheckChange,
  handleTrainingEmployeeCheckInAfterNoonCheckChange,
}) {
  const columns = [
    { name: "First Name", uid: "firstName" },
    { name: "Last Name", uid: "lastName" },
    { name: "Morning Check", uid: "morningCheck" },
    { name: "AfterNoon Check", uid: "afterNoonCheck" },
  ];

  const renderCell = (item, columnKey) => {
    const employee = item.TrainingEmployeeCheckInEmployeeId;

    switch (columnKey) {
      case "firstName":
        return employee?.employeeFirstname || "-";
      case "lastName":
        return employee?.employeeLastname || "-";
      case "morningCheck":
        return (
          <Input
            type="datetime-local"
            value={item.trainingEmployeeCheckInMorningCheck || ""}
            onChange={(e) =>
              handleTrainingEmployeeCheckInMorningCheckChange(
                item.trainingEmployeeCheckInId,
                e.target.value
              )
            }
            placeholder="Enter Morning Check Time"
          />
        );
      case "afterNoonCheck":
        return (
          <Input
            type="datetime-local"
            value={item.trainingEmployeeCheckInAfterNoonCheck || ""}
            onChange={(e) =>
              handleTrainingEmployeeCheckInAfterNoonCheckChange(
                item.trainingEmployeeCheckInId,
                e.target.value
              )
            }
            placeholder="Enter AfterNoon Check Time"
          />
        );
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
      <div className="w-full p-2 border-2 border-dark border-dashed">
        <div className="overflow-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.uid}
                    className="px-4 py-2 border-2 border-dark border-dashed bg-gray-200 text-left"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.trainingEmployeeCheckIn.length > 0 ? (
                formData.trainingEmployeeCheckIn.map((item) => (
                  <tr key={item.trainingEmployeeCheckInId}>
                    {columns.map((column) => (
                      <td
                        key={column.uid}
                        className="px-4 py-2 border-2 border-dark border-dashed"
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
                    className="px-4 py-2 border-2 border-dark border-dashed text-center"
                  >
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="submit" color="primary">
          Update
        </Button>
        <Button type="button" color="warning" onPass={onClear}>
          Clear
        </Button>
      </div>
    </form>
  );
}
