"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormCv from "@/components/form/hr/cv/FormCv";
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
  cvEmployeeId: "",
  educations: [], // เพิ่มการเก็บข้อมูลการศึกษา
  // licenses: [],
  // workHistories: [],
  // projects: [],
};

export default function CvUpdate({ params: paramsPromise }) {
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
  const cvId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const cvRes = await fetch(`/api/hr/cv/${cvId}`, {
        method: "GET",
        headers: {
          "secret-token": SECRET_TOKEN,
        },
      });

      const cvData = await cvRes.json();
      if (cvRes.ok) {
        const cv = cvData.cv[0];
        // สมมติว่า cvData มีข้อมูลของ educations ด้วย
        setFormData({
          cvEmployeeId: cv.cvEmployeeId,
          educations: cv.CvEducation || [],
          // licenses: cv.CvProfessionalLicense || [],
          // workHistories: cv.CvWorkHistory || [],
          // projects: cv.CvProject || [],
        });
      } else {
        toast.error(cvData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [cvId]);

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

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของการศึกษา
  const handleEducationChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedEducations = [...(prev.educations || [])];
      updatedEducations[index] = {
        ...updatedEducations[index],
        [field]: value,
      };
      return { ...prev, educations: updatedEducations };
    });
  }, []);

  const addNewEducationEntry = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...(prev.educations || []),
        {
          cvEducationDegree: "",
          cvEducationInstitution: "",
          cvEducationStartDate: "",
          cvEducationEndDate: "",
        },
      ],
    }));
  }, []);

  const removeEducationEntry = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  }, []);
  
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);
      formDataObject.append("cvUpdateBy", userId);
      formDataObject.append(
        "educations",
        JSON.stringify(formData.educations || [])
      );
      // formDataObject.append("licenses", JSON.stringify(formData.licenses || []));
      // formDataObject.append("workHistories", JSON.stringify(formData.workHistories || []));
      // formDataObject.append("projects", JSON.stringify(formData.projects || []));

      try {
        const res = await fetch(`/api/hr/cv/${cvId}`, {
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
          toast.error(jsonData.error || "Error updating cv");
        }
      } catch (error) {
        toast.error("Error updating cv: " + error.message);
      }
    },
    [cvId, router, userId, formData]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Cv Update" />
      <Toaster position="top-right" />
      <FormCv
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
        handleEducationChange={handleEducationChange}
        addNewEducationEntry={addNewEducationEntry}
        removeEducationEntry={removeEducationEntry}
      />
    </>
  );
}