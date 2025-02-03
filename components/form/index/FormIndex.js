"use client";
import React from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Logout, User } from "@/components/icons/icons";

export default function FormIndex({
  handleSubmit,
  userUsername,
  setUserUsername,
  userPassword,
  setUserPassword,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full min-h-[500px] xl:w-4/12 p-2 gap-2 bg-white rounded-3xl"
    >
      <div className="flex items-center justify-center w-full h-full p-2 gap-2">
        <Image
          width={100}
          height={100}
          src="/images/company_logo/company_logo.png"
          alt="company_logo"
          priority={true}
        />
      </div>

      <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-lg font-[600] text-danger">
        Channakorn Internal System
      </div>

      <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-danger">
        <Input
          type="text"
          label="Username"
          placeholder="Please Enter Data"
          labelPlacement="outside"
          size="lg"
          variant="bordered"
          color="danger"
          startContent={<User />}
          value={userUsername}
          onChange={(e) => setUserUsername(e.target.value)}
          isRequired
        />
      </div>

      <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-danger">
        <Input
          type="password"
          label="Password"
          placeholder="Please Enter Data"
          labelPlacement="outside"
          size="lg"
          variant="bordered"
          color="danger"
          startContent={<Logout />}
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          isRequired
        />
      </div>

      <div className="flex items-center justify-end w-full h-full p-2 gap-2 text-danger">
        <Checkbox color="danger" size="md" defaultSelected={false}>
          Keep me logged in
        </Checkbox>
      </div>

      <div className="flex items-center justify-center w-full h-full p-2 gap-2">
        <Button
          size="lg"
          color="danger"
          className="w-1/2 text-white"
          type="submit"
        >
          Login
        </Button>
      </div>

      <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-danger">
        If You Don&#39;t Account
        <Link href="/register" className="font-[600] text-danger">
          Register
        </Link>
      </div>
    </form>
  );
}
