"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import FormRegister from "@/components/form/register/FormRegister";

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    employeeTitle: "",
    employeeFirstnameTH: "",
    employeeLastnameTH: "",
    employeeFirstnameEN: "",
    employeeLastnameEN: "",
    employeeNickname: "",
    employeeEmail: "",
    employeeTel: "",
    employeeIdCard: "",
    employeeCitizen: "",
    employeeGender: "",
    employeeBirthday: "",
  });

  const handleInputChange = (field) => (e) => {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

    try {
      const res = await fetch("/api/register", {
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
          router.push("/");
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
        toast.error(jsonData.error || "Error Register");
      }
    } catch (error) {
      toast.error("Error Register: " + error.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <FormRegister
        formRef={formRef}
        onSubmit={handleSubmit}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </>
  );
}
