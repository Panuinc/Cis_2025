"use client";
import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Cancel, Database } from "@/components/icons/icons";

export default function FormCvTH({
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
            name="employeeFirstnameTH"
            type="text"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeFirstnameTH || ""}
            onChange={handleInputChange("employeeFirstnameTH")}
            isInvalid={!!errors.employeeFirstnameTH}
            errorMessage={errors.employeeFirstnameTH}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeLastnameTH"
            type="text"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="flat"
            readOnly
            value={formData.employeeLastnameTH || ""}
            onChange={handleInputChange("employeeLastnameTH")}
            isInvalid={!!errors.employeeLastnameTH}
            errorMessage={errors.employeeLastnameTH}
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
                  name={`cvTHLanguageSkillName_${index}`}
                  type="text"
                  label="Language Name"
                  placeholder="e.g. English, Japanese"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={skill.cvTHLanguageSkillName || ""}
                  onChange={(e) =>
                    handleLanguageSkillChange(
                      index,
                      "cvTHLanguageSkillName",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                {/* Select ของ Next UI */}
                <Select
                  name={`cvTHLanguageSkillProficiency_${index}`}
                  label="Proficiency"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Proficiency"
                  size="lg"
                  // แปลงค่าใน state เป็น selectedKeys (Set) ของ NextUI
                  selectedKeys={
                    skill.cvTHLanguageSkillProficiency
                      ? new Set([skill.cvTHLanguageSkillProficiency])
                      : new Set(["BASIC"])
                  }
                  onSelectionChange={(keys) => {
                    // แปลง selectedKeys กลับเป็น string ตัวเดียว
                    const selectedValue = Array.from(keys)[0];
                    handleLanguageSkillChange(
                      index,
                      "cvTHLanguageSkillProficiency",
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
                  name={`cvTHEducationDegree_${index}`}
                  type="text"
                  label="Degree"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvTHEducationDegree || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvTHEducationDegree",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHEducationInstitution_${index}`}
                  type="text"
                  label="Institution"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={education.cvTHEducationInstitution || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvTHEducationInstitution",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHEducationStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvTHEducationStartDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvTHEducationStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHEducationEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={education.cvTHEducationEndDate || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "cvTHEducationEndDate",
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
                  name={`cvTHProfessionalLicenseName_${index}`}
                  type="text"
                  label="License Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvTHProfessionalLicenseName || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvTHProfessionalLicenseName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHProfessionalLicenseNumber_${index}`}
                  type="text"
                  label="License Number"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={license.cvTHProfessionalLicenseNumber || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvTHProfessionalLicenseNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHProfessionalLicenseStartDate_${index}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvTHProfessionalLicenseStartDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvTHProfessionalLicenseStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHProfessionalLicenseEndDate_${index}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={license.cvTHProfessionalLicenseEndDate || ""}
                  onChange={(e) =>
                    handleLicenseChange(
                      index,
                      "cvTHProfessionalLicenseEndDate",
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
                  name={`cvTHWorkHistoryCompanyName_${wIndex}`}
                  type="text"
                  label="Company Name"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvTHWorkHistoryCompanyName || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvTHWorkHistoryCompanyName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHWorkHistoryPosition_${wIndex}`}
                  type="text"
                  label="Position"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={workHistory.cvTHWorkHistoryPosition || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvTHWorkHistoryPosition",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHWorkHistoryStartDate_${wIndex}`}
                  type="number"
                  label="Start Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvTHWorkHistoryStartDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvTHWorkHistoryStartDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                <Input
                  name={`cvTHWorkHistoryEndDate_${wIndex}`}
                  type="number"
                  label="End Year"
                  placeholder="Please Enter Data"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={workHistory.cvTHWorkHistoryEndDate || ""}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      wIndex,
                      "cvTHWorkHistoryEndDate",
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
                        name={`cvTHProjectName_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Name"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvTHProjectName || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvTHProjectName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
                      <Input
                        name={`cvTHProjectDescription_${wIndex}_${pIndex}`}
                        type="text"
                        label="Project Description"
                        placeholder="Please Enter Data"
                        labelPlacement="outside"
                        size="lg"
                        variant="bordered"
                        value={project.cvTHProjectDescription || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            wIndex,
                            pIndex,
                            "cvTHProjectDescription",
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
