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
        return employee?.employeeFirstnameTH || "-";
      case "lastName":
        return employee?.employeeLastnameTH || "-";
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
        const hasCertificate = item.trainingEmployeeCertificatePicture;

        return item.trainingEmployeeResult === "Pass" ? (
          hasCertificate ? (
            <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="success"
                className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
                onPress={() => {
                  const imageUrl = `/images/certificateFile/${item.trainingEmployeeCertificatePicture}`;
                  window.open(imageUrl, "_blank");
                }}
              >
                ดูรูปภาพ
              </Button>
              <Button
                size="md"
                color="warning"
                className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
                onPress={() => {
                  handleTrainingEmployeeCertificateChange(
                    item.trainingEmployeeId,
                    null
                  );
                }}
              >
                เปลี่ยนไฟล์
              </Button>
            </div>
          ) : (
            <Input
              name="trainingEmployeeCertificatePicture"
              type="file"
              size="lg"
              variant="bordered"
              onChange={(e) => {
                const file = e.target.files[0];
                handleTrainingEmployeeCertificateChange(
                  item.trainingEmployeeId,
                  file
                );
              }}
            />
          )
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
              {formData.trainingEmployee.length > 0 ? (
                formData.trainingEmployee.map((item) => (
                  <tr key={item.trainingEmployeeId}>
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
