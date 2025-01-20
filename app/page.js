"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";
import FormIndex from "@/components/form/index/FormIndex";

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
        <FormIndex
          handleSubmit={handleSubmit}
          userUsername={userUsername}
          setUserUsername={setUserUsername}
          userPassword={userPassword}
          setUserPassword={setUserPassword}
        />
      </>
    );
  } else {
    return null;
  }
}
