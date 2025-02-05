"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function FormTrainingCheckIn({
  formData,
  handleTrainingEmployeeCheckInMorningCheckChange,
  handleTrainingEmployeeCheckInAfterNoonCheckChange,
}) {
  const router = useRouter(); 

  const columns = [
    { name: "First Name", uid: "firstName" },
    { name: "Last Name", uid: "lastName" },
    { name: "Morning Check", uid: "morningCheck" },
    { name: "AfterNoon Check", uid: "afterNoonCheck" },
  ];

  const renderCell = (item, columnKey) => {
    const employee = item.TrainingEmployeeCheckInEmployeeId;
    const employment = employee?.employeeEmployment?.[0];
    const signaturePath = employment?.employmentSignature
      ? `/images/signature/${employment.employmentSignature}`
      : null;

    switch (columnKey) {
      case "firstName":
        return employee?.employeeFirstnameTH || "-";
      case "lastName":
        return employee?.employeeLastnameTH || "-";
      case "morningCheck":
        return item.trainingEmployeeCheckInMorningCheck && signaturePath ? (
          <img
            src={signaturePath}
            alt="Employee Signature"
            className="h-12 w-auto"
          />
        ) : (
          <Button
            color="success"
            onPress={() =>
              handleTrainingEmployeeCheckInMorningCheckChange(
                item.trainingEmployeeCheckInId
              )
            }
          >
            {item.trainingEmployeeCheckInMorningCheck
              ? new Date(
                  item.trainingEmployeeCheckInMorningCheck
                ).toLocaleString()
              : "Check In"}
          </Button>
        );

      case "afterNoonCheck":
        return item.trainingEmployeeCheckInAfterNoonCheck && signaturePath ? (
          <img
            src={signaturePath}
            alt="Employee Signature"
            className="h-12 w-auto"
          />
        ) : (
          <Button
            color="secondary"
            onPress={() =>
              handleTrainingEmployeeCheckInAfterNoonCheckChange(
                item.trainingEmployeeCheckInId
              )
            }
          >
            {item.trainingEmployeeCheckInAfterNoonCheck
              ? new Date(
                  item.trainingEmployeeCheckInAfterNoonCheck
                ).toLocaleString()
              : "Check In"}
          </Button>
        );

      default:
        return "";
    }
  };

  return (
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

      <div className="mt-4">
        <Button color="success" onPress={() => router.push("/training")}>
          Back
        </Button>
      </div>
    </div>
  );
}
