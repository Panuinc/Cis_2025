"use client";
import React from "react";
import { Cancel, Database } from "@/components/icons/icons";
import { Input, Button } from "@nextui-org/react";

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
  const renderPreview = (preview) => {
    if (!preview || !preview.previewURL) return null;

    if (preview.isPDF) {
      return (
        <Button
          size="md"
          color="success"
          onPress={() => window.open(preview.previewURL, "_blank")}
          type="button"
          className="flex items-center justify-center p-6 gap-2 border-2 border-dark border-dashed"
        >
          Open File
        </Button>
      );
    } else {
      return (
        <img
          src={preview.previewURL}
          alt="File Preview"
          className="flex items-center justify-center w-40 h-40 p-2 gap-2 border-2 border-dark border-dashed object-contain rounded-md mt-2"
        />
      );
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
      encType="multipart/form-data"
    >
      {formData.employeeCitizen && formData.employeeCitizen === "Thai" && (
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
              {formData.empDocumentIdCardFile == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsIdCardFile)}
                </div>
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
              {formData.empDocumentHomeFile == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsHomeFile)}
                </div>
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
              {formData.empDocumentSumFile == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsSumFile)}
                </div>
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
              {formData.empDocumentPassportFile == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsPassportFile)}
                </div>
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
              {formData.empDocumentImmigrationFile == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsImmigrationFile)}
                </div>
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
              {formData.empDocumentVisa1File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsVisa1File)}
                </div>
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
              {formData.empDocumentVisa2File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsVisa2File)}
                </div>
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
              {formData.empDocumentVisa3File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsVisa3File)}
                </div>
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
              {formData.empDocumentVisa4File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsVisa4File)}
                </div>
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
              {formData.empDocumentVisa5File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsVisa5File)}
                </div>
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
              {formData.empDocumentWorkPermit1File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsWorkPermit1File)}
                </div>
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
              {formData.empDocumentWorkPermit2File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsWorkPermit2File)}
                </div>
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
              {formData.empDocumentWorkPermit3File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsWorkPermit3File)}
                </div>
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
              {formData.empDocumentWorkPermit4File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsWorkPermit4File)}
                </div>
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
              {formData.empDocumentWorkPermit5File == "" || (
                <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                  {renderPreview(previewsWorkPermit5File)}
                </div>
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
