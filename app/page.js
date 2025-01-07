"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Logout, User } from "@/components/icons/icons";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";

export default function Index() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const router = useRouter();

  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        userUsername,
        userPassword,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("เข้าสู่ระบบสำเร็จ");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }
  if (!session) {
    return (
      <>
        <Toaster position="top-right" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-full min-h-[500px] xl:w-4/12 p-2 gap-2 border-2 bg-white rounded-3xl shadow-md"
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
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 text-lg font-[600]">
            Channakorn Internal System
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Input
              type="text"
              label="Username"
              placeholder="Please Enter Data"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              startContent={<User />}
              value={userUsername}
              onChange={(e) => setUserUsername(e.target.value)}
              isRequired={true}
            />
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Input
              type="password"
              label="Password"
              placeholder="Please Enter Data"
              labelPlacement="outside"
              size="lg"
              variant="bordered"
              startContent={<Logout />}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              isRequired={true}
            />
          </div>
          <div className="flex items-center justify-end w-full h-full p-2 gap-2">
            <Checkbox color="success" size="md" defaultSelected={false}>
              Keep me logged in
            </Checkbox>
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Button size="lg" color="success" className="w-1/2" type="submit">
              Login
            </Button>
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            If You Don&#39;t Account
            <Link href="/register" className="font-[600] text-success">
              Register
            </Link>
          </div>
        </form>
      </>
    );
  } else {
    return null;
  }
}
