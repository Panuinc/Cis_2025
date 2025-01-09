"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormRole from "@/components/form/hr/role/FormRole";

export default function RoleCreate() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const operatedBy = `${userData?.employee?.employeeFirstname || ""} ${
    userData?.employee?.employeeLastname || ""
  }`;
  
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ roleName: "" });

  const formRef = useRef(null);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const formDataObject = new FormData(formRef.current);
      formDataObject.append("roleCreateBy", userData?.userId);

      try {
        const res = await fetch("/api/hr/role", {
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
            router.push("/role");
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
          toast.error(jsonData.error || "Error creating role");
        }
      } catch (error) {
        toast.error("Error creating role: " + error.message);
      }
    },
    [router, userData?.userId]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {})
    );
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Role Create" />
      <Toaster position="top-right" />
      <FormRole
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
        operatedBy={operatedBy}
      />
    </>
  );
}
