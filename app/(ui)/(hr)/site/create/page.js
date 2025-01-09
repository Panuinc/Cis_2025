"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormSite from "@/components/form/hr/site/FormSite";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;
const DEFAULT_FORM_DATA = { siteBranchId: "", siteName: "" };

export default function SiteCreate() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const userId = userData?.userId;

  const operatedBy = useMemo(
    () =>
      `${userData?.employee?.employeeFirstname || ""} ${
        userData?.employee?.employeeLastname || ""
      }`,
    [userData]
  );

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await fetch(`/api/hr/branch`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          const activeBranch = (jsonData.branch || []).filter(
            (branch) => branch.branchStatus === "Active"
          );
          setBranch(activeBranch);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching branch");
      }
    };

    fetchBranch();
  }, []);

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
      formDataObject.append("siteCreateBy", userId);

      try {
        const res = await fetch("/api/hr/site", {
          method: "POST",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();

        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/site");
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
          toast.error(jsonData.error || "Error creating site");
        }
      } catch (error) {
        toast.error("Error creating site: " + error.message);
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
      <TopicHeader topic="Site Create" />
      <Toaster position="top-right" />
      <FormSite
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
