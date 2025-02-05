"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormEmployee from "@/components/form/hr/employee/FormEmployee";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  use,
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

const DEFAULT_FORM_DATA = {
  employeeTitle: "",
  employeeFirstnameTH: "",
  employeeLastnameTH: "",
  employeeFirstnameEN: "",
  employeeLastnameEN: "",
  employeeNickname: "",
  employeeEmail: "",
  employeeTel: "",
  employeeIdCard: "",
  employeeBirthday: "",
  employeeCitizen: "",
  employeeGender: "",
  employeeStatus: "",
};

export default function EmployeeUpdate({ params: paramsPromise }) {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const userId = userData?.userId;

  const operatedBy = useMemo(
    () =>
      `${userData?.employee?.employeeFirstnameTH || ""} ${
        userData?.employee?.employeeLastnameTH || ""
      }`,
    [userData]
  );

  const params = use(paramsPromise);
  const employeeId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [employeeRes] = await Promise.all([
        fetch(`/api/hr/employee/${employeeId}`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
      ]);

      const employeeData = await employeeRes.json();
      if (employeeRes.ok) {
        const employee = employeeData.employee[0];
        setFormData(employee);
      } else {
        toast.error(employeeData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [employeeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (prev[field]) {
          const { [field]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);
      formDataObject.append("employeeUpdateBy", userId);

      try {
        const res = await fetch(`/api/hr/employee/${employeeId}`, {
          method: "PUT",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();

        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/employee");
          }, 2000);
        } else {
          if (jsonData.details) {
            const fieldErrorObj = jsonData.details.reduce((acc, err) => {
              const fieldName = err.field && err.field[0];
              if (fieldName) {
                acc[fieldName] = err.message;
              }
              return acc;
            }, {});
            setErrors(fieldErrorObj);
          }
          toast.error(jsonData.error || "Error updating employee");
        }
      } catch (error) {
        toast.error("Error updating employee: " + error.message);
      }
    },
    [employeeId, router, userId]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Employee Update" />
      <Toaster position="top-right" />
      <FormEmployee
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
