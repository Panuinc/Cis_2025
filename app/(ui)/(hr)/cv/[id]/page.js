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
  employeeFirstname: "",
  employeeLastname: "",
  employeeBirthday: "",
  employeeEmail: "",
  educations: [],
  licenses: [],
  workHistories: [],
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
        setFormData({
          cvEmployeeId: cv.cvEmployeeId,
          employeeFirstname: cv.employee?.employeeFirstname || "",
          employeeLastname: cv.employee?.employeeLastname || "",
          employeeBirthday: cv.employee?.employeeBirthday || "",
          employeeEmail: cv.employee?.employeeEmail || "",
          educations: cv.educations || [],
          licenses: cv.licenses || [],
          workHistories: cv.workHistories || [],
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

  const handleLicenseChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedLicenses = [...(prev.licenses || [])];
      updatedLicenses[index] = {
        ...updatedLicenses[index],
        [field]: value,
      };
      return { ...prev, licenses: updatedLicenses };
    });
  }, []);

  const addNewLicenseEntry = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      licenses: [
        ...(prev.licenses || []),
        {
          cvProfessionalLicenseName: "",
          cvProfessionalLicenseNumber: "",
          cvProfessionalLicenseStartDate: "",
          cvProfessionalLicenseEndDate: "",
        },
      ],
    }));
  }, []);

  const removeLicenseEntry = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index),
    }));
  }, []);

  const handleWorkHistoryChange = useCallback((workIndex, field, value) => {
    setFormData((prev) => {
      const updatedWorkHistories = [...(prev.workHistories || [])];
      updatedWorkHistories[workIndex] = {
        ...updatedWorkHistories[workIndex],
        [field]: value,
      };
      return { ...prev, workHistories: updatedWorkHistories };
    });
  }, []);

  const addNewWorkHistoryEntry = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      workHistories: [
        ...(prev.workHistories || []),
        {
          cvWorkHistoryCompanyName: "",
          cvWorkHistoryPosition: "",
          cvWorkHistoryStartDate: "",
          cvWorkHistoryEndDate: "",
          projects: [],
        },
      ],
    }));
  }, []);

  const removeWorkHistoryEntry = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      workHistories: prev.workHistories.filter((_, i) => i !== index),
    }));
  }, []);

  const handleProjectChange = useCallback(
    (workIndex, projectIndex, field, value) => {
      setFormData((prev) => {
        const updatedWorkHistories = [...(prev.workHistories || [])];
        const workHistory = updatedWorkHistories[workIndex] || {};
        const projects = [...(workHistory.projects || [])];
        projects[projectIndex] = {
          ...projects[projectIndex],
          [field]: value,
        };
        updatedWorkHistories[workIndex] = {
          ...workHistory,
          projects,
        };
        return { ...prev, workHistories: updatedWorkHistories };
      });
    },
    []
  );

  const addNewProjectEntry = useCallback((workIndex) => {
    setFormData((prev) => {
      const updatedWorkHistories = [...(prev.workHistories || [])];
      const workHistory = updatedWorkHistories[workIndex] || {};
      const projects = [...(workHistory.projects || [])];
      projects.push({
        cvProjectName: "",
        cvProjectDescription: "",
      });
      updatedWorkHistories[workIndex] = {
        ...workHistory,
        projects,
      };
      return { ...prev, workHistories: updatedWorkHistories };
    });
  }, []);

  const removeProjectEntry = useCallback((workIndex, projectIndex) => {
    setFormData((prev) => {
      const updatedWorkHistories = [...(prev.workHistories || [])];
      const workHistory = updatedWorkHistories[workIndex] || {};
      const projects = [...(workHistory.projects || [])];
      projects.splice(projectIndex, 1);
      updatedWorkHistories[workIndex] = {
        ...workHistory,
        projects,
      };
      return { ...prev, workHistories: updatedWorkHistories };
    });
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
      formDataObject.append(
        "licenses",
        JSON.stringify(formData.licenses || [])
      );
      formDataObject.append(
        "workHistories",
        JSON.stringify(formData.workHistories || [])
      );

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
        handleLicenseChange={handleLicenseChange}
        addNewLicenseEntry={addNewLicenseEntry}
        removeLicenseEntry={removeLicenseEntry}
        handleWorkHistoryChange={handleWorkHistoryChange}
        addNewWorkHistoryEntry={addNewWorkHistoryEntry}
        removeWorkHistoryEntry={removeWorkHistoryEntry}
        handleProjectChange={handleProjectChange}
        addNewProjectEntry={addNewProjectEntry}
        removeProjectEntry={removeProjectEntry}
      />
    </>
  );
}
