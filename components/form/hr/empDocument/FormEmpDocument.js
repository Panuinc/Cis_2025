"use client";
import React from "react";
import { Cancel, Database } from "@/components/icons/icons";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";

export default function FormEmpDocument({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,

  previewsIdCardFile,
  previewsHomeFile,

  previewsSumFile,
  previewsPassportFile,
  previewsImmigrationFile,

  previewsVisa1File,
  previewsVisa2File,
  previewsVisa3File,
  previewsVisa4File,
  previewsVisa5File,

  previewsWorkPermit1File,
  previewsWorkPermit2File,
  previewsWorkPermit3File,
  previewsWorkPermit4File,
  previewsWorkPermit5File,

  isUpdate = false,
  operatedBy = "",
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
      encType="multipart/form-data"
    >
      {formData.employeeCitizen && formData.employeeCitizen == "Thai" && (
        <>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentIdCardFile"
                type="file"
                label="EmpDocument Id Card File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentIdCardFile")}
                isInvalid={!!errors.empDocumentIdCardFile}
                errorMessage={errors.empDocumentIdCardFile}
              />
              {previewsIdCardFile.empDocumentIdCardFile && (
                <img
                  src={previewsIdCardFile.empDocumentIdCardFile}
                  alt="EmpDocument Id Card Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentHomeFile"
                type="file"
                label="EmpDocument Home File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentHomeFile")}
                isInvalid={!!errors.empDocumentHomeFile}
                errorMessage={errors.empDocumentHomeFile}
              />
              {previewsHomeFile.empDocumentHomeFile && (
                <img
                  src={previewsHomeFile.empDocumentHomeFile}
                  alt="EmpDocument Home Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
          </div>
        </>
      )}
      {formData.employeeCitizen && formData.employeeCitizen !== "Thai" && (
        <>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentSumFile"
                type="file"
                label="EmpDocument Sum File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentSumFile")}
                isInvalid={!!errors.empDocumentSumFile}
                errorMessage={errors.empDocumentSumFile}
              />
              {previewsSumFile.empDocumentSumFile && (
                <img
                  src={previewsSumFile.empDocumentSumFile}
                  alt="EmpDocument Sum File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentPassportFile"
                type="file"
                label="EmpDocument Passport File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentPassportFile")}
                isInvalid={!!errors.empDocumentPassportFile}
                errorMessage={errors.empDocumentPassportFile}
              />
              {previewsPassportFile.empDocumentPassportFile && (
                <img
                  src={previewsPassportFile.empDocumentPassportFile}
                  alt="EmpDocument Passport File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentImmigrationFile"
                type="file"
                label="EmpDocument Immigration File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentImmigrationFile")}
                isInvalid={!!errors.empDocumentImmigrationFile}
                errorMessage={errors.empDocumentImmigrationFile}
              />
              {previewsImmigrationFile.empDocumentImmigrationFile && (
                <img
                  src={previewsImmigrationFile.empDocumentImmigrationFile}
                  alt="EmpDocument Immigration File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentVisa1File"
                type="file"
                label="Visa 1 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentVisa1File")}
                isInvalid={!!errors.empDocumentVisa1File}
                errorMessage={errors.empDocumentVisa1File}
              />
              {previewsVisa1File.empDocumentVisa1File && (
                <img
                  src={previewsVisa1File.empDocumentVisa1File}
                  alt="EmpDocument Visa 1 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentVisa2File"
                type="file"
                label="Visa 2 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentVisa2File")}
                isInvalid={!!errors.empDocumentVisa2File}
                errorMessage={errors.empDocumentVisa2File}
              />
              {previewsVisa2File.empDocumentVisa2File && (
                <img
                  src={previewsVisa2File.empDocumentVisa2File}
                  alt="EmpDocument Visa 2 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentVisa3File"
                type="file"
                label="Visa 3 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentVisa3File")}
                isInvalid={!!errors.empDocumentVisa3File}
                errorMessage={errors.empDocumentVisa3File}
              />
              {previewsVisa3File.empDocumentVisa3File && (
                <img
                  src={previewsVisa3File.empDocumentVisa3File}
                  alt="EmpDocument Visa 3 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentVisa4File"
                type="file"
                label="Visa 4 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentVisa4File")}
                isInvalid={!!errors.empDocumentVisa4File}
                errorMessage={errors.empDocumentVisa4File}
              />
              {previewsVisa4File.empDocumentVisa4File && (
                <img
                  src={previewsVisa4File.empDocumentVisa4File}
                  alt="EmpDocument Visa 4 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentVisa5File"
                type="file"
                label="Visa 5 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentVisa5File")}
                isInvalid={!!errors.empDocumentVisa5File}
                errorMessage={errors.empDocumentVisa5File}
              />
              {previewsVisa5File.empDocumentVisa5File && (
                <img
                  src={previewsVisa5File.empDocumentVisa5File}
                  alt="EmpDocument Visa 5 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentWorkPermit1File"
                type="file"
                label="Work Permit 1 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentWorkPermit1File")}
                isInvalid={!!errors.empDocumentWorkPermit1File}
                errorMessage={errors.empDocumentWorkPermit1File}
              />
              {previewsWorkPermit1File.empDocumentWorkPermit1File && (
                <img
                  src={previewsWorkPermit1File.empDocumentWorkPermit1File}
                  alt="EmpDocument Work Permit 1 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentWorkPermit2File"
                type="file"
                label="Work Permit 2 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentWorkPermit2File")}
                isInvalid={!!errors.empDocumentWorkPermit2File}
                errorMessage={errors.empDocumentWorkPermit2File}
              />
              {previewsWorkPermit2File.empDocumentWorkPermit2File && (
                <img
                  src={previewsWorkPermit2File.empDocumentWorkPermit2File}
                  alt="EmpDocument Work Permit 2 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentWorkPermit3File"
                type="file"
                label="Work Permit 3 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentWorkPermit3File")}
                isInvalid={!!errors.empDocumentWorkPermit3File}
                errorMessage={errors.empDocumentWorkPermit3File}
              />
              {previewsWorkPermit3File.empDocumentWorkPermit3File && (
                <img
                  src={previewsWorkPermit3File.empDocumentWorkPermit3File}
                  alt="EmpDocument Work Permit 3 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentWorkPermit4File"
                type="file"
                label="Work Permit 4 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentWorkPermit4File")}
                isInvalid={!!errors.empDocumentWorkPermit4File}
                errorMessage={errors.empDocumentWorkPermit4File}
              />
              {previewsWorkPermit4File.empDocumentWorkPermit4File && (
                <img
                  src={previewsWorkPermit4File.empDocumentWorkPermit4File}
                  alt="EmpDocument Work Permit 4 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Input
                name="empDocumentWorkPermit5File"
                type="file"
                label="Work Permit 5 File"
                labelPlacement="outside"
                size="lg"
                variant="bordered"
                onChange={handleInputChange("empDocumentWorkPermit5File")}
                isInvalid={!!errors.empDocumentWorkPermit5File}
                errorMessage={errors.empDocumentWorkPermit5File}
              />
              {previewsWorkPermit5File.empDocumentWorkPermit5File && (
                <img
                  src={previewsWorkPermit5File.empDocumentWorkPermit5File}
                  alt="EmpDocument Work Permit 5 File Preview"
                  className="w-40 h-40 object-contain rounded-md"
                />
              )}
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
