"use client";
import React from "react";
import { Switch, Input, Button } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormTrainingResult({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",

  handleTrainingEmployeeResultChange,
  handleTrainingEmployeeCertificateChange,
}) {
  const columns = [
    { name: "FirstName", uid: "firstName" },
    { name: "LastName", uid: "lastName" },
    { name: "Result", uid: "result" },
    { name: "Certificate", uid: "certificateLink" },
  ];

  const renderCell = (item, columnKey) => {
    const employee = item.TrainingEmployeeEmployeeId;

    switch (columnKey) {
      case "firstName":
        return employee?.employeeFirstname || "-";
      case "lastName":
        return employee?.employeeLastname || "-";
      case "result": {
        return (
          <Switch
            isSelected={item.trainingEmployeeResult === "Pass"}
            color="success"
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
        return item.trainingEmployeeResult === "Pass" ? (
          <Input
            name="trainingEmployeeCertificatePicture"
            type="text"
            label="Training Certificate"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={item.trainingEmployeeCertificatePicture || ""}
            onChange={(e) =>
              handleTrainingEmployeeCertificateChange(
                item.trainingEmployeeId,
                e.target.value
              )
            }
            isInvalid={!!errors.trainingEmployeeCertificatePicture}
            errorMessage={errors.trainingEmployeeCertificatePicture}
            clearable
          />
        ) : (
          "-"
        );
      }
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
      {isUpdate && (
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
              {formData.trainingEmployee.length > 0 ? (
                formData.trainingEmployee.map((item) => (
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
        </div>
      )}

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
            type="url"
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
