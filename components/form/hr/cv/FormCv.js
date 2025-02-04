"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
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
                  name={`cvLanguageSkillName_${index}`}
                  type="text"
                  label="Language Name"
                  placeholder="e.g. English, Japanese"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={skill.cvLanguageSkillName || ""}
                  onChange={(e) =>
                    handleLanguageSkillChange(
                      index,
                      "cvLanguageSkillName",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                {/* Select ของ Next UI */}
                <Select
                  name={`cvLanguageSkillProficiency_${index}`}
                  label="Proficiency"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Proficiency"
                  size="lg"
                  // แปลงค่าใน state เป็น selectedKeys (Set) ของ NextUI
                  selectedKeys={
                    skill.cvLanguageSkillProficiency
                      ? new Set([skill.cvLanguageSkillProficiency])
                      : new Set(["BASIC"])
                  }
                  onSelectionChange={(keys) => {
                    // แปลง selectedKeys กลับเป็น string ตัวเดียว
                    const selectedValue = Array.from(keys)[0];
                    handleLanguageSkillChange(
                      index,
                      "cvLanguageSkillProficiency",
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
                  name={`cvProfessionalLicenseName_${index}`}
                  type="text"
                  label="License Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvProfessionalLicenseName || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvProfessionalLicenseName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvProfessionalLicenseNumber_${index}`}
                  type="text"
                  label="License Number"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvProfessionalLicenseNumber || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvProfessionalLicenseNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvProfessionalLicenseStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvProfessionalLicenseStartDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvProfessionalLicenseStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvProfessionalLicenseEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvProfessionalLicenseEndDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvProfessionalLicenseEndDate",
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
                  name={`cvWorkHistoryCompanyName_${wIndex}`}
                  type="text"
                  label="Company Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvWorkHistoryCompanyName || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvWorkHistoryCompanyName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvWorkHistoryPosition_${wIndex}`}
                  type="text"
                  label="Position"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvWorkHistoryPosition || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvWorkHistoryPosition",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvWorkHistoryStartDate_${wIndex}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvWorkHistoryStartDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvWorkHistoryStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvWorkHistoryEndDate_${wIndex}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvWorkHistoryEndDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvWorkHistoryEndDate",
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
                        name={`cvProjectName_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Name"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvProjectName || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvProjectName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                      <Input
                        name={`cvProjectDescription_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Description"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvProjectDescription || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvProjectDescription",
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
