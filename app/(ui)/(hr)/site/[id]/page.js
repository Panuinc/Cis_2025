"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {
  use,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormSite from "@/components/form/hr/site/FormSite";

export default function SiteUpdate({ params: paramsPromise }) {
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

  const params = use(paramsPromise);
  const siteId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [formData, setFormData] = useState({
    siteName: "",
    siteStatus: "",
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
    const fetchSite = async () => {
      try {
        const res = await fetch(`/api/hr/site/${siteId}`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();
        if (res.ok) {
          const site = jsonData.site[0];
          setFormData(site);
        } else {
          toast.error(jsonData.error);
        }
      } catch (error) {
        toast.error("Error fetching site data");
      }
    };

    fetchSite();
  }, [siteId]);

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
      formDataObject.append("siteUpdateBy", userId);

      try {
        const res = await fetch(`/api/hr/site/${siteId}`, {
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
            router.push("/site");
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
          toast.error(jsonData.error || "Error updating site");
        }
      } catch (error) {
        toast.error("Error updating site: " + error.message);
      }
    },
    [siteId, router, userId]
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
      <TopicHeader topic="Site Update" />
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
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
