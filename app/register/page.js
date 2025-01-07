"use client";
import React from "react";
import { Input, Button, DatePicker } from "@nextui-org/react";
import Link from "next/link";
import { Logout, User, Email, Contact, Hr, Gender, LeaveWork } from "@/components/icons/icons";

export default function Index() {
  return (
    <form className="flex flex-col items-center justify-start w-full h-full xl:w-4/12 p-2 gap-2 border-2 border-dark border-dashed bg-white rounded-3xl shadow-sm overflow-auto">
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        Register
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Title"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<User />}
            // value={userUsername}
            // onChange={(e) => setUserUsername(e.target.value)}
            // isRequired={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Firstname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<User />}
            // value={userPassword}
            // onChange={(e) => setUserPassword(e.target.value)}
            // isRequired={true}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Lastname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<User />}
            // value={userUsername}
            // onChange={(e) => setUserUsername(e.target.value)}
            // isRequired={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Nickname"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<User />}
            // value={userPassword}
            // onChange={(e) => setUserPassword(e.target.value)}
            // isRequired={true}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="email"
            label="Email"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<Email />}
            // value={userUsername}
            // onChange={(e) => setUserUsername(e.target.value)}
            // isRequired={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="number"
            label="Telephone"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<Contact />}
            // value={userPassword}
            // onChange={(e) => setUserPassword(e.target.value)}
            // isRequired={true}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="number"
            label="ID Card"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<Hr />}
            // value={userUsername}
            // onChange={(e) => setUserUsername(e.target.value)}
            // isRequired={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Citizen"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<User />}
            // value={userPassword}
            // onChange={(e) => setUserPassword(e.target.value)}
            // isRequired={true}
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <Input
            type="text"
            label="Gender"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<Gender />}
            // value={userUsername}
            // onChange={(e) => setUserUsername(e.target.value)}
            // isRequired={true}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <DatePicker
            type="text"
            label="Birthday"
            placeholder="Please Enter Data"
            labelPlacement="outside"
            size="lg"
            variant="bordered"
            startContent={<LeaveWork />}
            // value={userPassword}
            // onChange={(e) => setUserPassword(e.target.value)}
            // isRequired={true}
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Button size="lg" color="success" className="w-1/2" type="submit">
          Register
        </Button>
      </div>
      <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        If You Have Account
        <Link href="/" className="font-[600] text-success">
          Login
        </Link>
      </div>
    </form>
  );
}
