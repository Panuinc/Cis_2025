"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormCvEN({
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

  handleLicenseChange,
  addNewLicenseEntry,
  removeLicenseEntry,

  handleWorkHistoryChange,
  addNewWorkHistoryEntry,
  removeWorkHistoryEntry,

  handleProjectChange,
  addNewProjectEntry,
  removeProjectEntry,

  handleLanguageSkillChange,
  addNewLanguageSkillEntry,
  removeLanguageSkillEntry,
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
            name="employeeFirstnameEN"
            type="text"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeFirstnameEN || ""}
            onChange={handleInputChange("employeeFirstnameEN")}
            isInvalid={!!errors.employeeFirstnameEN}
            errorMessage={errors.employeeFirstnameEN}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeLastnameEN"
            type="text"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeLastnameEN || ""}
            onChange={handleInputChange("employeeLastnameEN")}
            isInvalid={!!errors.employeeLastnameEN}
            errorMessage={errors.employeeLastnameEN}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
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
        {/* Title */}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
          Language Skills
        </div>

        {/* Loop แสดงผล Language Skill ที่มีอยู่ */}
        {formData.languageSkills?.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
          >
            {/* แบ่งเป็น 2 ช่อง (Language Name / Proficiency) */}
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENLanguageSkillName_${index}`}
                  type="text"
                  label="Language Name"
                  placeholder="e.g. English, Japanese"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={skill.cvENLanguageSkillName || ""}
                  onChange={(e) =>
                    handleLanguageSkillChange(
                      index,
                      "cvENLanguageSkillName",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                {/* Select ของ Next UI */}
                <Select
                  name={`cvENLanguageSkillProficiency_${index}`}
                  label="Proficiency"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Proficiency"
                  size="lg"
                  // แปลงค่าใน state เป็น selectedKeys (Set) ของ NextUI
                  selectedKeys={
                    skill.cvENLanguageSkillProficiency
                      ? new Set([skill.cvENLanguageSkillProficiency])
                      : new Set(["BASIC"])
                  }
                  onSelectionChange={(keys) => {
                    // แปลง selectedKeys กลับเป็น string ตัวเดียว
                    const selectedValue = Array.from(keys)[0];
                    handleLanguageSkillChange(
                      index,
                      "cvENLanguageSkillProficiency",
                      selectedValue
                    );
                  }}
                >
                  <SelectItem key="BASIC">BASIC</SelectItem>
                  <SelectItem key="INTERMEDIATE">INTERMEDIATE</SelectItem>
                  <SelectItem key="ADVANCED">ADVANCED</SelectItem>
                </Select>
              </div>
            </div>

            {/* ปุ่ม Cancel Language Skill */}
            <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="danger"
                startContent={<Cancel />}
                onPress={() => removeLanguageSkillEntry(index)}
              >
                Cancel Language Skill
              </Button>
            </div>
          </div>
        ))}

        {/* ปุ่ม Add Language Skill */}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="warning"
            startContent={<Database />}
            onPress={addNewLanguageSkillEntry}
          >
            Add Language Skill
          </Button>
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
                  name={`cvENEducationDegree_${index}`}
                  type="text"
                  label="Degree"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvENEducationDegree || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvENEducationDegree",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENEducationInstitution_${index}`}
                  type="text"
                  label="Institution"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvENEducationInstitution || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvENEducationInstitution",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENEducationStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvENEducationStartDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvENEducationStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENEducationEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvENEducationEndDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvENEducationEndDate",
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
                Cancel Education
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="warning"
            startContent={<Database />}
            onPress={addNewEducationEntry}
          >
            Add Education
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
          Licenses
        </div>
        {formData.licenses?.map((license, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
          >
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENProfessionalLicenseName_${index}`}
                  type="text"
                  label="License Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvENProfessionalLicenseName || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvENProfessionalLicenseName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENProfessionalLicenseNumber_${index}`}
                  type="text"
                  label="License Number"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvENProfessionalLicenseNumber || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvENProfessionalLicenseNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENProfessionalLicenseStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvENProfessionalLicenseStartDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvENProfessionalLicenseStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENProfessionalLicenseEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvENProfessionalLicenseEndDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvENProfessionalLicenseEndDate",
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
                onPress={() => removeLicenseEntry(index)}
              >
                Cancel License
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="warning"
            startContent={<Database />}
            onPress={addNewLicenseEntry}
          >
            Add License
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
          Work Histories
        </div>
        {formData.workHistories?.map((workHistory, wIndex) => (
          <div
            key={wIndex}
            className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
          >
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENWorkHistoryCompanyName_${wIndex}`}
                  type="text"
                  label="Company Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvENWorkHistoryCompanyName || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvENWorkHistoryCompanyName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENWorkHistoryPosition_${wIndex}`}
                  type="text"
                  label="Position"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvENWorkHistoryPosition || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvENWorkHistoryPosition",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENWorkHistoryStartDate_${wIndex}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvENWorkHistoryStartDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvENWorkHistoryStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvENWorkHistoryEndDate_${wIndex}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvENWorkHistoryEndDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvENWorkHistoryEndDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed font-[600]">
                projects
              </div>
              {workHistory.projects?.map((project, pIndex) => (
                <div
                  key={pIndex}
                  className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
                >
                  <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                    <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                      <Input
                        name={`cvENProjectName_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Name"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvENProjectName || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvENProjectName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                      <Input
                        name={`cvENProjectDescription_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Description"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvENProjectDescription || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvENProjectDescription",
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
                      onPress={() => removeProjectEntry(wIndex, pIndex)}
                    >
                      Cancel Project
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Button
                  size="md"
                  color="warning"
                  startContent={<Database />}
                  onPress={() => addNewProjectEntry(wIndex)}
                >
                  Add Project
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Button
                size="md"
                color="danger"
                startContent={<Cancel />}
                onPress={() => removeWorkHistoryEntry(wIndex)}
              >
                Cancel Work History
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Button
            size="md"
            color="warning"
            startContent={<Database />}
            onPress={addNewWorkHistoryEntry}
          >
            Add Work History
          </Button>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
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
