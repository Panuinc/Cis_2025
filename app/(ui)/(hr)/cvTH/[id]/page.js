"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import TopicHeader from "@/components/form/TopicHeader";
import FormCvTH from "@/components/form/hr/cvTH/FormCvTH";
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
  cvTHEmployeeId: "",
  employeeFirstname: "",
  employeeLastname: "",
  employeeBirthday: "",
  employeeEmail: "",
  educations: [],
  licenses: [],
  workHistories: [],
  languageSkills: [],
};

export default function CvTHUpdate({ params: paramsPromise }) {
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
  const cvTHId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const cvTHRes = await fetch(`/api/hr/cvTH/${cvTHId}`, {
        method: "GET",
        headers: {
          "secret-token": SECRET_TOKEN,
        },
      });

      const cvTHData = await cvTHRes.json();
      if (cvTHRes.ok) {
        const cvTH = cvTHData.cvTH[0];
        setFormData({
          cvTHEmployeeId: cvTH.cvTHEmployeeId,
          employeeFirstname: cvTH.employee?.employeeFirstname || "",
          employeeLastname: cvTH.employee?.employeeLastname || "",
          employeeBirthday: cvTH.employee?.employeeBirthday || "",
          employeeEmail: cvTH.employee?.employeeEmail || "",
          educations: cvTH.educations || [],
          licenses: cvTH.licenses || [],
          workHistories: cvTH.workHistories || [],
          languageSkills: cvTH.languageSkills || [],
        });
      } else {
        toast.error(cvTHData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [cvTHId]);

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
          cvTHEducationDegree: "",
          cvTHEducationInstitution: "",
          cvTHEducationStartDate: "",
          cvTHEducationEndDate: "",
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
          cvTHProfessionalLicenseName: "",
          cvTHProfessionalLicenseNumber: "",
          cvTHProfessionalLicenseStartDate: "",
          cvTHProfessionalLicenseEndDate: "",
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
          cvTHWorkHistoryCompanyName: "",
          cvTHWorkHistoryPosition: "",
          cvTHWorkHistoryStartDate: "",
          cvTHWorkHistoryEndDate: "",
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
        cvTHProjectName: "",
        cvTHProjectDescription: "",
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

  const handleLanguageSkillChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedLanguageSkills = [...(prev.languageSkills || [])];
      updatedLanguageSkills[index] = {
        ...updatedLanguageSkills[index],
        [field]: value,
      };
      return { ...prev, languageSkills: updatedLanguageSkills };
    });
  }, []);

  const addNewLanguageSkillEntry = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      languageSkills: [
        ...(prev.languageSkills || []),
        {
          cvTHLanguageSkillName: "",
          cvTHLanguageSkillProficiency: "BASIC",
        },
      ],
    }));
  }, []);

  const removeLanguageSkillEntry = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      languageSkills: prev.languageSkills.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);
      formDataObject.append("cvTHUpdateBy", userId);

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
      formDataObject.append(
        "languageSkills",
        JSON.stringify(formData.languageSkills || [])
      );

      try {
        const res = await fetch(`/api/hr/cvTH/${cvTHId}`, {
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
          toast.error(jsonData.error || "Error updating cvTH");
        }
      } catch (error) {
        toast.error("Error updating cvTH: " + error.message);
      }
    },
    [cvTHId, router, userId, formData]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  const handleExportPdf = useCallback(async () => {
    try {
      const response = await fetch(`/api/hr/cvTH/exportCvTH/${cvTHId}`, {
        method: "GET",
        headers: {
          "secret-token": SECRET_TOKEN,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Export failed with status:", response.status, errorText);
        throw new Error("Failed to export PDF");
      }

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      window.open(blobURL);
    } catch (error) {
      console.error("Export PDF error:", error);
    }
  }, [cvTHId]);

  return (
    <>
      <TopicHeader topic="CvTH Update" />
      <Toaster position="top-right" />
      <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <Button size="md" color="success" onPress={handleExportPdf}>
          Export PDF CV
        </Button>
      </div>
      <FormCvTH
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
        handleLanguageSkillChange={handleLanguageSkillChange}
        addNewLanguageSkillEntry={addNewLanguageSkillEntry}
        removeLanguageSkillEntry={removeLanguageSkillEntry}
      />
    </>
  );
}
