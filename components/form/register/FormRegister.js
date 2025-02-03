"use client";
import React from "react";
import Link from "next/link";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import {
  User,
  Email,
  Contact,
  Hr,
  Gender,
  LeaveWork,
} from "@/components/icons/icons";

export default function FormRegister({
  formRef,
  onSubmit,
  errors = {},
  formData,
  handleInputChange,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-start w-full h-full xl:w-4/12 p-2 gap-2 bg-white bg-opacity-50 shadow-md rounded-3xl overflow-auto"
    >
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-lg font-[600] text-success">
        Register Now!
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Select
            name="employeeTitle"
            label="Title"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<User />}
            value={formData.employeeTitle || ""}
            selectedKeys={[formData.employeeTitle] || ""}
            onChange={handleInputChange("employeeTitle")}
            isInvalid={!!errors.employeeTitle}
            errorMessage={errors.employeeTitle}
          >
            <SelectItem value="Mr" key="Mr">
              Mr
            </SelectItem>
            <SelectItem value="Mrs" key="Mrs">
              Mrs
            </SelectItem>
            <SelectItem value="Ms" key="Ms">
              Ms
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="text"
            name="employeeFirstname"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<User />}
            value={formData.employeeFirstname || ""}
            onChange={handleInputChange("employeeFirstname")}
            isInvalid={!!errors.employeeFirstname}
            errorMessage={errors.employeeFirstname}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="text"
            name="employeeLastname"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<User />}
            value={formData.employeeLastname || ""}
            onChange={handleInputChange("employeeLastname")}
            isInvalid={!!errors.employeeLastname}
            errorMessage={errors.employeeLastname}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="text"
            name="employeeNickname"
            label="Nickname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<User />}
            value={formData.employeeNickname || ""}
            onChange={handleInputChange("employeeNickname")}
            isInvalid={!!errors.employeeNickname}
            errorMessage={errors.employeeNickname}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="email"
            name="employeeEmail"
            label="Email"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<Email />}
            value={formData.employeeEmail || ""}
            onChange={handleInputChange("employeeEmail")}
            isInvalid={!!errors.employeeEmail}
            errorMessage={errors.employeeEmail}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="number"
            name="employeeTel"
            label="Telephone"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<Contact />}
            value={formData.employeeTel || ""}
            onChange={handleInputChange("employeeTel")}
            isInvalid={!!errors.employeeTel}
            errorMessage={errors.employeeTel}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            type="number"
            name="employeeIdCard"
            label="ID Card"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<Hr />}
            value={formData.employeeIdCard || ""}
            onChange={handleInputChange("employeeIdCard")}
            isInvalid={!!errors.employeeIdCard}
            errorMessage={errors.employeeIdCard}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Select
            name="employeeCitizen"
            label="Citizen"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<User />}
            value={formData.employeeCitizen || ""}
            selectedKeys={[formData.employeeCitizen] || ""}
            onChange={handleInputChange("employeeCitizen")}
            isInvalid={!!errors.employeeCitizen}
            errorMessage={errors.employeeCitizen}
          >
            <SelectItem value="Thai" key="Thai">
              Thai
            </SelectItem>
            <SelectItem value="Cambodian" key="Cambodian">
              Cambodian
            </SelectItem>
            <SelectItem value="Lao" key="Lao">
              Lao
            </SelectItem>
            <SelectItem value="Burmese" key="Burmese">
              Burmese
            </SelectItem>
            <SelectItem value="Vietnamese" key="Vietnamese">
              Vietnamese
            </SelectItem>
          </Select>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Select
            name="employeeGender"
            label="Gender"
            placeholder="Please Select Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<Gender />}
            value={formData.employeeGender || ""}
            selectedKeys={[formData.employeeGender] || ""}
            onChange={handleInputChange("employeeGender")}
            isInvalid={!!errors.employeeGender}
            errorMessage={errors.employeeGender}
          >
            <SelectItem value="Male" key="Male">
              Male
            </SelectItem>
            <SelectItem value="FeMale" key="FeMale">
              FeMale
            </SelectItem>
          </Select>
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-success">
          <Input
            name="employeeBirthday"
            type="date"
            label="Employee Birthday"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            color="success"
            startContent={<LeaveWork />}
            value={formData.employeeBirthday || ""}
            onChange={handleInputChange("employeeBirthday")}
            isInvalid={!!errors.employeeBirthday}
            errorMessage={errors.employeeBirthday}
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full p-2 gap-2">
        <Button
          size="lg"
          color="success"
          className="w-1/2 text-white"
          type="submit"
        >
          Register
        </Button>
      </div>
      <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success">
        If You Have Account
        <Link href="/" className="font-[600] text-success">
          Login
        </Link>
      </div>
    </form>
  );
}
