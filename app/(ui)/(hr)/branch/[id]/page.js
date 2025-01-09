"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { use, useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormBranch from "@/components/form/hr/branch/FormBranch";

export default function BranchUpdate({ params: paramsPromise }) {
  const { data: session } = useSession();
  const userData = session?.user || {};

  const params = use(paramsPromise);
  const branchId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    branchName: "",
    branchStatus: "",
  });

  const formRef = useRef(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await fetch(`/api/hr/branch/${branchId}`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          const branch = jsonData.branch[0];
          setFormData(branch);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching branch data");
      }
    };

    fetchBranch();
  }, [branchId]);

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
    formDataObject.append("branchUpdateBy", userData?.userId);

    try {
      const res = await fetch(`/api/hr/branch/${branchId}`, {
        method: "PUT",
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
        toast.error(jsonData.error || "Error updating branch");
      }
    } catch (error) {
      toast.error("Error updating branch: " + error.message);
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
      <TopicHeader topic="Branch Update" />
      <Toaster position="top-right" />
      <FormBranch
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={`${userData?.employee?.employeeFirstname || ""} ${
          userData?.employee?.employeeLastname || ""
        }`}
      />
    </>
  );
}
