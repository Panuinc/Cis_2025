"use client";
import React from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Logout, User } from "@/components/icons/icons";

export default function Index() {
  return (
    <form className="flex flex-col items-center justify-center w-full min-h-[500px] xl:w-4/12 p-2 gap-2 border-2 border-dark border-dashed bg-white rounded-3xl shadow-sm">
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Image
          width={100}
          height={100}
          src="/images/company_logo/company_logo.png"
          alt="company_logo"
          priority={true}
        />
      </div>
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        Channakorn Internal System
      </div>
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Input
          type="text"
          label="Username"
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
          type="password"
          label="Password"
          placeholder="Please Enter Data"
          labelPlacement="outside"
          size="lg"
          variant="bordered"
          startContent={<Logout />}
          // value={userPassword}
          // onChange={(e) => setUserPassword(e.target.value)}
          // isRequired={true}
        />
      </div>
      <div className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Checkbox color="success" size="md" defaultSelected={false}>
          Keep me logged in
        </Checkbox>
      </div>
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Button size="lg" color="success" className="w-1/2" type="submit">
          Login
        </Button>
      </div>
      <div className="flex items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        If You Don&#39;t Account
        <Link href="/register" className="font-[600] text-success">
          Register
        </Link>
      </div>
    </form>
  );
}
