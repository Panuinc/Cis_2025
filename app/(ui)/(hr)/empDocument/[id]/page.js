"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormEmpDocument from "@/components/form/hr/empDocument/FormEmpDocument";
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
  empDocumentIdCardFile: null,
  empDocumentHomeFile: null,

  empDocumentSumFile: null,
  empDocumentPassportFile: null,
  empDocumentImmigrationFile: null,

  empDocumentVisa1File: null,
  empDocumentVisa2File: null,
  empDocumentVisa3File: null,
  empDocumentVisa4File: null,
  empDocumentVisa5File: null,
  empDocumentWorkPermit1File: null,
  empDocumentWorkPermit2File: null,
  empDocumentWorkPermit3File: null,
  empDocumentWorkPermit4File: null,
  empDocumentWorkPermit5File: null,
};

export default function EmpDocumentUpdate({ params: paramsPromise }) {
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
  const empDocumentId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const [previewsIdCardFile, setPreviewsIdCardFile] = useState({ empDocumentIdCardFile: null });
  const [previewsHomeFile, setPreviewsHomeFile] = useState({ empDocumentHomeFile: null });

  const [previewsSumFile, setPreviewsSumFile] = useState({ empDocumentSumFile: null });
  const [previewsPassportFile, setPreviewsPassportFile] = useState({ empDocumentPassportFile: null });
  const [previewsImmigrationFile, setPreviewsImmigrationFile] = useState({ empDocumentImmigrationFile: null });

  const [previewsVisa1File, setPreviewsVisa1File] = useState({ empDocumentVisa1File: null });
  const [previewsVisa2File, setPreviewsVisa2File] = useState({ empDocumentVisa2File: null });
  const [previewsVisa3File, setPreviewsVisa3File] = useState({ empDocumentVisa3File: null });
  const [previewsVisa4File, setPreviewsVisa4File] = useState({ empDocumentVisa4File: null });
  const [previewsVisa5File, setPreviewsVisa5File] = useState({ empDocumentVisa5File: null });

  const [previewsWorkPermit1File, setPreviewsWorkPermit1File] = useState({ empDocumentWorkPermit1File: null });
  const [previewsWorkPermit2File, setPreviewsWorkPermit2File] = useState({ empDocumentWorkPermit2File: null });
  const [previewsWorkPermit3File, setPreviewsWorkPermit3File] = useState({ empDocumentWorkPermit3File: null });
  const [previewsWorkPermit4File, setPreviewsWorkPermit4File] = useState({ empDocumentWorkPermit4File: null });
  const [previewsWorkPermit5File, setPreviewsWorkPermit5File] = useState({ empDocumentWorkPermit5File: null });

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [empDocumentRes] = await Promise.all([
        fetch(`/api/hr/empDocument/${empDocumentId}`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
      ]);

      const empDocumentData = await empDocumentRes.json();
      if (empDocumentRes.ok) {
        const empDocument = empDocumentData.empDocument[0];
        setFormData({...empDocument,employeeCitizen:empDocument.EmpDocumentEmployeeBy?.employeeCitizen || "",});
        if (empDocument.empDocumentIdCardFile) {setPreviewsIdCardFile((prev) => ({...prev,empDocumentIdCardFile: `/images/idCardFile/${empDocument.empDocumentIdCardFile}`,}));}
        if (empDocument.empDocumentHomeFile) {setPreviewsHomeFile((prev) => ({...prev,empDocumentHomeFile: `/images/homeFile/${empDocument.empDocumentHomeFile}`,}));}

        if (empDocument.empDocumentSumFile) {setPreviewsSumFile((prev) => ({...prev,empDocumentSumFile: `/images/sumFile/${empDocument.empDocumentSumFile}`,}));}
        if (empDocument.empDocumentPassportFile) {setPreviewsPassportFile((prev) => ({...prev,empDocumentPassportFile: `/images/passportFile/${empDocument.empDocumentPassportFile}`,}));}
        if (empDocument.empDocumentImmigrationFile) {setPreviewsImmigrationFile((prev) => ({...prev,empDocumentImmigrationFile: `/images/immigrationFile/${empDocument.empDocumentImmigrationFile}`,}));}

        if (empDocument.empDocumentVisa1File) {setPreviewsVisa1File((prev) => ({...prev,empDocumentVisa1File: `/images/visa1File/${empDocument.empDocumentVisa1File}`,}));}
        if (empDocument.empDocumentVisa2File) {setPreviewsVisa2File((prev) => ({...prev,empDocumentVisa2File: `/images/visa2File/${empDocument.empDocumentVisa2File}`,}));}
        if (empDocument.empDocumentVisa3File) {setPreviewsVisa3File((prev) => ({...prev,empDocumentVisa3File: `/images/visa3File/${empDocument.empDocumentVisa3File}`,}));}
        if (empDocument.empDocumentVisa4File) {setPreviewsVisa4File((prev) => ({...prev,empDocumentVisa4File: `/images/visa4File/${empDocument.empDocumentVisa4File}`,}));}
        if (empDocument.empDocumentVisa5File) {setPreviewsVisa5File((prev) => ({...prev,empDocumentVisa5File: `/images/visa5File/${empDocument.empDocumentVisa5File}`,}));}

        if (empDocument.empDocumentWorkPermit1File) {setPreviewsWorkPermit1File((prev) => ({...prev,empDocumentWorkPermit1File: `/images/workPermit1File/${empDocument.empDocumentWorkPermit1File}`,}));}
        if (empDocument.empDocumentWorkPermit2File) {setPreviewsWorkPermit2File((prev) => ({...prev,empDocumentWorkPermit2File: `/images/workPermit2File/${empDocument.empDocumentWorkPermit2File}`,}));}
        if (empDocument.empDocumentWorkPermit3File) {setPreviewsWorkPermit3File((prev) => ({...prev,empDocumentWorkPermit3File: `/images/workPermit3File/${empDocument.empDocumentWorkPermit3File}`,}));}
        if (empDocument.empDocumentWorkPermit4File) {setPreviewsWorkPermit4File((prev) => ({...prev,empDocumentWorkPermit4File: `/images/workPermit4File/${empDocument.empDocumentWorkPermit4File}`,}));}
        if (empDocument.empDocumentWorkPermit5File) {setPreviewsWorkPermit5File((prev) => ({...prev,empDocumentWorkPermit5File: `/images/workPermit5File/${empDocument.empDocumentWorkPermit5File}`,}));}

      } else {
        toast.error(empDocumentData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [empDocumentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (field) => (e) => {
    const isFileField = field.startsWith("empDocument") && field.endsWith("File");
    const value = isFileField ? e.target.files[0] : e.target.value;
  
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  
    if (isFileField) {
      const file = e.target.files[0];
      if (file) {
        const previewSetter = {
          empDocumentIdCardFile: setPreviewsIdCardFile,
          empDocumentHomeFile: setPreviewsHomeFile,
          empDocumentSumFile: setPreviewsSumFile,
          empDocumentPassportFile: setPreviewsPassportFile,
          empDocumentImmigrationFile: setPreviewsImmigrationFile,
          empDocumentVisa1File: setPreviewsVisa1File,
          empDocumentVisa2File: setPreviewsVisa2File,
          empDocumentVisa3File: setPreviewsVisa3File,
          empDocumentVisa4File: setPreviewsVisa4File,
          empDocumentVisa5File: setPreviewsVisa5File,
          empDocumentWorkPermit1File: setPreviewsWorkPermit1File,
          empDocumentWorkPermit2File: setPreviewsWorkPermit2File,
          empDocumentWorkPermit3File: setPreviewsWorkPermit3File,
          empDocumentWorkPermit4File: setPreviewsWorkPermit4File,
          empDocumentWorkPermit5File: setPreviewsWorkPermit5File,
        };
  
        if (previewSetter[field]) {
          previewSetter[field]((prev) => ({
            ...prev,
            [field]: URL.createObjectURL(file),
          }));
        }
      }
    }
  
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };
  
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);
      formDataObject.append("empDocumentUpdateBy", userId);

      if (formData.empDocumentIdCardFile) {formDataObject.append("empDocumentIdCardFile",formData.empDocumentIdCardFile);}
      if (formData.empDocumentHomeFile) {formDataObject.append("empDocumentHomeFile",formData.empDocumentHomeFile);}

      if (formData.empDocumentSumFile) {formDataObject.append("empDocumentSumFile",formData.empDocumentSumFile);}
      if (formData.empDocumentPassportFile) {formDataObject.append("empDocumentPassportFile",formData.empDocumentPassportFile);}
      if (formData.empDocumentImmigrationFile) {formDataObject.append("empDocumentImmigrationFile",formData.empDocumentImmigrationFile);}

      if (formData.empDocumentVisa1File) {formDataObject.append("empDocumentVisa1File",formData.empDocumentVisa1File);}
      if (formData.empDocumentVisa2File) {formDataObject.append("empDocumentVisa2File",formData.empDocumentVisa2File);}
      if (formData.empDocumentVisa3File) {formDataObject.append("empDocumentVisa3File",formData.empDocumentVisa3File);}
      if (formData.empDocumentVisa4File) {formDataObject.append("empDocumentVisa4File",formData.empDocumentVisa4File);}
      if (formData.empDocumentVisa5File) {formDataObject.append("empDocumentVisa5File",formData.empDocumentVisa5File);}

      if (formData.empDocumentWorkPermit1File) {formDataObject.append("empDocumentWorkPermit1File",formData.empDocumentWorkPermit1File);}
      if (formData.empDocumentWorkPermit2File) {formDataObject.append("empDocumentWorkPermit2File",formData.empDocumentWorkPermit2File);}
      if (formData.empDocumentWorkPermit3File) {formDataObject.append("empDocumentWorkPermit3File",formData.empDocumentWorkPermit3File);}
      if (formData.empDocumentWorkPermit4File) {formDataObject.append("empDocumentWorkPermit4File",formData.empDocumentWorkPermit4File);}
      if (formData.empDocumentWorkPermit5File) {formDataObject.append("empDocumentWorkPermit5File",formData.empDocumentWorkPermit5File);}

      let method = "PUT";
      if (
        ["Cambodian", "Lao", "Burmese", "Vietnamese"].includes(
          formData.employeeCitizen
        )
      ) {
        method = "PATCH";
      }

      try {
        const res = await fetch(`/api/hr/empDocument/${empDocumentId}`, {
          method,
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
          toast.error(jsonData.error || "Error updating empDocument");
        }
      } catch (error) {
        toast.error("Error updating empDocument: " + error.message);
      }
    },
    [
      empDocumentId,
      router,
      userId,
      formData.employeeCitizen,
      
      formData.empDocumentIdCardFile,
      formData.empDocumentHomeFile,

      formData.empDocumentSumFile,
      formData.empDocumentPassportFile,
      formData.empDocumentImmigrationFile,

      formData.empDocumentVisa1File,
      formData.empDocumentVisa2File,
      formData.empDocumentVisa3File,
      formData.empDocumentVisa4File,
      formData.empDocumentVisa5File,

      formData.empDocumentWorkPermit1File,
      formData.empDocumentWorkPermit2File,
      formData.empDocumentWorkPermit3File,
      formData.empDocumentWorkPermit4File,
      formData.empDocumentWorkPermit5File,
    ]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="EmpDocument Update" />
      <Toaster position="top-right" />
      <FormEmpDocument
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}

        previewsIdCardFile={previewsIdCardFile}
        previewsHomeFile={previewsHomeFile}

        previewsSumFile={previewsSumFile}
        previewsPassportFile={previewsPassportFile}
        previewsImmigrationFile={previewsImmigrationFile}

        previewsVisa1File={previewsVisa1File}
        previewsVisa2File={previewsVisa2File}
        previewsVisa3File={previewsVisa3File}
        previewsVisa4File={previewsVisa4File}
        previewsVisa5File={previewsVisa5File}

        
        previewsWorkPermit1File={previewsWorkPermit1File}
        previewsWorkPermit2File={previewsWorkPermit2File}
        previewsWorkPermit3File={previewsWorkPermit3File}
        previewsWorkPermit4File={previewsWorkPermit4File}
        previewsWorkPermit5File={previewsWorkPermit5File}

        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
