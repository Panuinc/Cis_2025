"use client";
import React from "react";
import { Cancel, Database } from "@/components/icons/icons";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";

export default function FormEmployee({
  formRef,
  onSubmit,
  onClear,
  errors = {},
  formData,
  handleInputChange,
  isUpdate = false,
  operatedBy = "",
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
    >
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employeeTitle"
            label="Title"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeTitle || ""}
            selectedKeys={[formData.employeeTitle] || ""}
            onChange={handleInputChange("employeeTitle")}
            isInvalid={!!errors.employeeTitle}
            errorMessage={errors.employeeTitle}
          >
            <SelectItem value="นาย" key="นาย">
              นาย
            </SelectItem>
            <SelectItem value="นาง" key="นาง">
              นาง
            </SelectItem>
            <SelectItem value="นางสาว" key="นางสาว">
              นางสาว
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            name="employeeFirstname"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeFirstname || ""}
            onChange={handleInputChange("employeeFirstname")}
            isInvalid={!!errors.employeeFirstname}
            errorMessage={errors.employeeFirstname}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            name="employeeLastname"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeLastname || ""}
            onChange={handleInputChange("employeeLastname")}
            isInvalid={!!errors.employeeLastname}
            errorMessage={errors.employeeLastname}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            name="employeeNickname"
            label="Nickname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeNickname || ""}
            onChange={handleInputChange("employeeNickname")}
            isInvalid={!!errors.employeeNickname}
            errorMessage={errors.employeeNickname}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="email"
            name="employeeEmail"
            label="Email"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeEmail || ""}
            onChange={handleInputChange("employeeEmail")}
            isInvalid={!!errors.employeeEmail}
            errorMessage={errors.employeeEmail}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="number"
            name="employeeTel"
            label="Telephone"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeTel || ""}
            onChange={handleInputChange("employeeTel")}
            isInvalid={!!errors.employeeTel}
            errorMessage={errors.employeeTel}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="number"
            name="employeeIdCard"
            label="ID Card"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeIdCard || ""}
            onChange={handleInputChange("employeeIdCard")}
            isInvalid={!!errors.employeeIdCard}
            errorMessage={errors.employeeIdCard}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employeeCitizen"
            label="Citizen"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeCitizen || ""}
            selectedKeys={[formData.employeeCitizen] || ""}
            onChange={handleInputChange("employeeCitizen")}
            isInvalid={!!errors.employeeCitizen}
            errorMessage={errors.employeeCitizen}
          >
            <SelectItem value="ไทย" key="ไทย">
              ไทย
            </SelectItem>
            <SelectItem value="กัมพูชา" key="กัมพูชา">
              กัมพูชา
            </SelectItem>
            <SelectItem value="ลาว" key="ลาว">
              ลาว
            </SelectItem>
            <SelectItem value="พม่า" key="พม่า">
              พม่า
            </SelectItem>
            <SelectItem value="เวียดนาม" key="เวียดนาม">
              เวียดนาม
            </SelectItem>
          </Select>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Select
            name="employeeGender"
            label="Gender"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeGender || ""}
            selectedKeys={[formData.employeeGender] || ""}
            onChange={handleInputChange("employeeGender")}
            isInvalid={!!errors.employeeGender}
            errorMessage={errors.employeeGender}
          >
            <SelectItem value="ชาย" key="ชาย">
              ชาย
            </SelectItem>
            <SelectItem value="หญิง" key="หญิง">
              หญิง
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            name="employeeBirthday"
            type="date"
            label="Employee Birthday"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            value={formData.employeeBirthday || ""}
            onChange={handleInputChange("employeeBirthday")}
            isInvalid={!!errors.employeeBirthday}
            errorMessage={errors.employeeBirthday}
          />
        </div>
      </div>
      {isUpdate && (
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Select
              name="employeeStatus"
              label="Status"
              placeholder="Please Select Status"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              value={formData.employeeStatus || ""}
              selectedKeys={[formData.employeeStatus] || ""}
              onChange={handleInputChange("employeeStatus")}
              isInvalid={!!errors.employeeStatus}
              errorMessage={errors.employeeStatus}
            >
              <SelectItem value="InActive" key="InActive">
                InActive
              </SelectItem>
              <SelectItem value="Active" key="Active">
                Active
              </SelectItem>
            </Select>
          </div>
        </div>
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
