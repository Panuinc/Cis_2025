"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormBranch from "@/components/form/hr/branch/FormBranch";

export default function BranchCreate() {
  const { data: session } = useSession();
  const userData = session?.user || {};

  const router = useRouter();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    branchName: "",
  });

  const formRef = useRef(null);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataObject = new FormData(formRef.current);
    formDataObject.append("branchCreateBy", userData?.userId);

    try {
      const res = await fetch("/api/hr/branch", {
        method: "POST",
        body: formDataObject,
        headers: {
          "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
        },
      });

      const jsonData = await res.json();

      if (res.ok) {
        toast.success(jsonData.message);
        setTimeout(() => {
          router.push("/branch");
        }, 2000);
      } else {
        if (jsonData.details) {
          const fieldErrorObj = {};
          jsonData.details.forEach((err) => {
            const fieldName = err.field && err.field[0];
            if (fieldName) {
              fieldErrorObj[fieldName] = err.message;
            }
          });
          setErrors(fieldErrorObj);
        }
        toast.error(jsonData.error || "Error creating branch");
      }
    } catch (error) {
      toast.error("Error creating branch: " + error.message);
    }
  };

  const handleClear = () => {
    formRef.current.reset();
    setFormData((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {})
    );
    setErrors({});
  };

  return (
    <>
      <TopicHeader topic="Branch Create" />
      <Toaster position="top-right" />
      <FormBranch
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
        operatedBy={`${userData?.employee?.employeeFirstname || ""} ${
          userData?.employee?.employeeLastname || ""
        }`}
      />
    </>
  );
}
