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
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeFirstname"
            type="text"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeFirstname || ""}
            onChange={handleInputChange("employeeFirstname")}
            isInvalid={!!errors.employeeFirstname}
            errorMessage={errors.employeeFirstname}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeLastname"
            type="text"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeLastname || ""}
            onChange={handleInputChange("employeeLastname")}
            isInvalid={!!errors.employeeLastname}
            errorMessage={errors.employeeLastname}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeBirthday"
            type="text"
            label="Birth Day"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeBirthday || ""}
            onChange={handleInputChange("employeeBirthday")}
            isInvalid={!!errors.employeeBirthday}
            errorMessage={errors.employeeBirthday}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeEmail"
            type="text"
            label="Email"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeEmail || ""}
            onChange={handleInputChange("employeeEmail")}
            isInvalid={!!errors.employeeEmail}
            errorMessage={errors.employeeEmail}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
          Educations
        </div>
        {formData.educations?.map((education, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
          >
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvEducationDegree_${index}`}
                  type="text"
                  label="Degree"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvEducationDegree || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvEducationDegree",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvEducationInstitution_${index}`}
                  type="text"
                  label="Institution"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvEducationInstitution || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvEducationInstitution",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvEducationStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvEducationStartDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvEducationStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvEducationEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvEducationEndDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvEducationEndDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="danger"
                startContent={<Cancel />}
                onPress={() => removeEducationEntry(index)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="warning"
            onPress={addNewEducationEntry}
            startContent={<Database />}
          >
            Add Education
          </Button>
        </div>
      </div>

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
