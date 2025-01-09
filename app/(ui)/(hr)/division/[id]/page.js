"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { use, useState, useRef, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormDivision from "@/components/form/hr/division/FormDivision";

export default function DivisionUpdate({ params: paramsPromise }) {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const operatedBy = `${userData?.employee?.employeeFirstname || ""} ${
    userData?.employee?.employeeLastname || ""
  }`;

  const params = use(paramsPromise);
  const divisionId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState({
    divisionName: "",
    divisionStatus: "",
  });

  const formRef = useRef(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await fetch(`/api/hr/branch`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          setBranch(jsonData.branch || []);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching branch");
      }
    };

    fetchBranch();
  }, []);

  useEffect(() => {
    const fetchDivision = async () => {
      try {
        const res = await fetch(`/api/hr/division/${divisionId}`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          const division = jsonData.division[0];
          setFormData(division);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching division data");
      }
    };

    fetchDivision();
  }, [divisionId]);

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
      formDataObject.append("divisionUpdateBy", userData?.userId);

      try {
        const res = await fetch(`/api/hr/division/${divisionId}`, {
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
            router.push("/division");
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
          toast.error(jsonData.error || "Error updating division");
        }
      } catch (error) {
        toast.error("Error updating division: " + error.message);
      }
    },
    [divisionId, router, userData?.userId]
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
      <TopicHeader topic="Division Update" />
      <Toaster position="top-right" />
      <FormDivision
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        branch={branch}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
