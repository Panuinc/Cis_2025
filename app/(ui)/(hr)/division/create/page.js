"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormDivision from "@/components/form/hr/division/FormDivision";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;
const DEFAULT_FORM_DATA = {
  divisionBranchId: "",
  divisionName: "",
};

export default function DivisionCreate() {
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

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [branchRes] = await Promise.all([
        fetch(`/api/hr/branch`, {
          method: "GET",
          headers: { "secret-token": SECRET_TOKEN },
        }),
      ]);

      const branchData = await branchRes.json();
      if (branchRes.ok) {
        const activeBranch = (branchData.branch || []).filter(
          (branch) => branch.branchStatus === "Active"
        );
        setBranch(activeBranch);
      } else {
        toast.error(branchData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, []);

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
      formDataObject.append("divisionCreateBy", userId);

      try {
        const res = await fetch("/api/hr/division", {
          method: "POST",
          body: formDataObject,
          headers: { "secret-token": SECRET_TOKEN },
        });

        const jsonData = await res.json();
        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/division");
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
          toast.error(jsonData.error || "Error creating division");
        }
      } catch (error) {
        toast.error("Error creating division: " + error.message);
      }
    },
    [router, userId]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Division Create" />
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
        operatedBy={operatedBy}
      />
    </>
  );
}
