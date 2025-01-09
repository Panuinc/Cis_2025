"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { use, useState, useRef, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormRole from "@/components/form/hr/role/FormRole";

export default function RoleUpdate({ params: paramsPromise }) {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const operatedBy = `${userData?.employee?.employeeFirstname || ""} ${
    userData?.employee?.employeeLastname || ""
  }`;

  const params = use(paramsPromise);
  const roleId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    roleName: "",
    roleStatus: "",
  });

  const formRef = useRef(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`/api/hr/role/${roleId}`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          const role = jsonData.role[0];
          setFormData(role);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching role data");
      }
    };

    fetchRole();
  }, [roleId]);

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
      formDataObject.append("roleUpdateBy", userData?.userId);

      try {
        const res = await fetch(`/api/hr/role/${roleId}`, {
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
          toast.error(jsonData.error || "Error updating role");
        }
      } catch (error) {
        toast.error("Error updating role: " + error.message);
      }
    },
    [roleId, router, userData?.userId]
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
      <TopicHeader topic="Role Update" />
      <Toaster position="top-right" />
      <FormRole
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
