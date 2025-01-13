"use client";
import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormCv({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",
  handleEducationChange,
  addNewEducationEntry,
  removeEducationEntry,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      {/* ฟิลด์ CV หลัก */}
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Input
          name="cvEmployeeId"
          type="text"
          label="Cv Employee Id"
          placeholder="Please Enter Data"
          labelPlacement="outside"
          size="lg"
          variant="bordered"
          value={formData.cvEmployeeId || ""}
          onChange={handleInputChange("cvEmployeeId")}
          isInvalid={!!errors.cvEmployeeId}
          errorMessage={errors.cvEmployeeId}
        />
      </div>

      {/* ฟิลด์ Operated By */}
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Input
          name="OperatedBy"
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

      {/* ส่วนการศึกษา (CvEducation) */}
      <div className="w-full p-2 border-2 border-dark border-dashed">
        <h3>Educations</h3>
        {formData.educations?.map((edu, index) => (
          <div key={index} className="flex flex-col gap-2 p-2 border mb-2">
            <Input
              name={`cvEducationDegree_${index}`}
              label="Degree"
              placeholder="Degree"
              value={edu.cvEducationDegree || ""}
              onChange={(e) =>
                handleEducationChange(
                  index,
                  "cvEducationDegree",
                  e.target.value
                )
              }
            />
            <Input
              name={`cvEducationInstitution_${index}`}
              label="Institution"
              placeholder="Institution"
              value={edu.cvEducationInstitution || ""}
              onChange={(e) =>
                handleEducationChange(
                  index,
                  "cvEducationInstitution",
                  e.target.value
                )
              }
            />
            <Input
              name={`cvEducationStartDate_${index}`}
              label="Start Year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={edu.cvEducationStartDate || ""}
              onChange={(e) =>
                handleEducationChange(
                  index,
                  "cvEducationStartDate",
                  e.target.value
                )
              }
            />
            <Input
              name={`cvEducationEndDate_${index}`}
              label="End Year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={edu.cvEducationEndDate || ""}
              onChange={(e) =>
                handleEducationChange(
                  index,
                  "cvEducationEndDate",
                  e.target.value
                )
              }
            />
            <Button
              size="sm"
              color="error"
              // startContent={<Delete />}
              onPress={() => removeEducationEntry(index)}
            >
              Cancel
            </Button>
          </div>
        ))}
        <Button onPress={addNewEducationEntry}>เพิ่มการศึกษา</Button>
      </div>

      {/* ปุ่ม Submit และ Cancel */}
      <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Button
          size="md"
          color="success"
          startContent={<Database />}
          type="submit"
        >
          Submit
        </Button>
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
    </form>
  );
}
