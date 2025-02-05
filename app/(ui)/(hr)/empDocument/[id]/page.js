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
      `${userData?.employee?.employeeFirstnameTH || ""} ${
        userData?.employee?.employeeLastnameTH || ""
      }`,
    [userData]
  );

  const params = use(paramsPromise);
  const empDocumentId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const [previewsIdCardFile, setPreviewsIdCardFile] = useState({ previewURL: null, isPDF: false });
  const [previewsHomeFile, setPreviewsHomeFile] = useState({ previewURL: null, isPDF: false });

  const [previewsSumFile, setPreviewsSumFile] = useState({ previewURL: null, isPDF: false });
  const [previewsPassportFile, setPreviewsPassportFile] = useState({ previewURL: null, isPDF: false });
  const [previewsImmigrationFile, setPreviewsImmigrationFile] = useState({ previewURL: null, isPDF: false });

  const [previewsVisa1File, setPreviewsVisa1File] = useState({ previewURL: null, isPDF: false });
  const [previewsVisa2File, setPreviewsVisa2File] = useState({ previewURL: null, isPDF: false });
  const [previewsVisa3File, setPreviewsVisa3File] = useState({ previewURL: null, isPDF: false });
  const [previewsVisa4File, setPreviewsVisa4File] = useState({ previewURL: null, isPDF: false });
  const [previewsVisa5File, setPreviewsVisa5File] = useState({ previewURL: null, isPDF: false });

  const [previewsWorkPermit1File, setPreviewsWorkPermit1File] = useState({ previewURL: null, isPDF: false });
  const [previewsWorkPermit2File, setPreviewsWorkPermit2File] = useState({ previewURL: null, isPDF: false });
  const [previewsWorkPermit3File, setPreviewsWorkPermit3File] = useState({ previewURL: null, isPDF: false });
  const [previewsWorkPermit4File, setPreviewsWorkPermit4File] = useState({ previewURL: null, isPDF: false });
  const [previewsWorkPermit5File, setPreviewsWorkPermit5File] = useState({ previewURL: null, isPDF: false });

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
        setFormData({
          ...empDocument,
          employeeCitizen: empDocument.EmpDocumentEmployeeBy?.employeeCitizen || "",
        });

        const setPreview = (fileName, setState, folder) => {
          if (fileName) {
            const fileUrl = `/images/${folder}/${fileName}`;
            const isPDF = fileName.toLowerCase().endsWith('.pdf');
            setState({ previewURL: fileUrl, isPDF });
          }
        };

        setPreview(empDocument.empDocumentIdCardFile, setPreviewsIdCardFile, "idCardFile");
        setPreview(empDocument.empDocumentHomeFile, setPreviewsHomeFile, "homeFile");

        setPreview(empDocument.empDocumentSumFile, setPreviewsSumFile, "sumFile");
        setPreview(empDocument.empDocumentPassportFile, setPreviewsPassportFile, "passportFile");
        setPreview(empDocument.empDocumentImmigrationFile, setPreviewsImmigrationFile, "immigrationFile");

        setPreview(empDocument.empDocumentVisa1File, setPreviewsVisa1File, "visa1File");
        setPreview(empDocument.empDocumentVisa2File, setPreviewsVisa2File, "visa2File");
        setPreview(empDocument.empDocumentVisa3File, setPreviewsVisa3File, "visa3File");
        setPreview(empDocument.empDocumentVisa4File, setPreviewsVisa4File, "visa4File");
        setPreview(empDocument.empDocumentVisa5File, setPreviewsVisa5File, "visa5File");

        setPreview(empDocument.empDocumentWorkPermit1File, setPreviewsWorkPermit1File, "workPermit1File");
        setPreview(empDocument.empDocumentWorkPermit2File, setPreviewsWorkPermit2File, "workPermit2File");
        setPreview(empDocument.empDocumentWorkPermit3File, setPreviewsWorkPermit3File, "workPermit3File");
        setPreview(empDocument.empDocumentWorkPermit4File, setPreviewsWorkPermit4File, "workPermit4File");
        setPreview(empDocument.empDocumentWorkPermit5File, setPreviewsWorkPermit5File, "workPermit5File");
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
        const previewURL = URL.createObjectURL(file);
        const isPDF = file.type === 'application/pdf';

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
          previewSetter[field]({ previewURL, isPDF });
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

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataObject.append(key, formData[key]);
        }
      });

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
      formData,
    ]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setPreviewsIdCardFile({ previewURL: null, isPDF: false });
    setPreviewsHomeFile({ previewURL: null, isPDF: false });
    setPreviewsSumFile({ previewURL: null, isPDF: false });
    setPreviewsPassportFile({ previewURL: null, isPDF: false });
    setPreviewsImmigrationFile({ previewURL: null, isPDF: false });
    setPreviewsVisa1File({ previewURL: null, isPDF: false });
    setPreviewsVisa2File({ previewURL: null, isPDF: false });
    setPreviewsVisa3File({ previewURL: null, isPDF: false });
    setPreviewsVisa4File({ previewURL: null, isPDF: false });
    setPreviewsVisa5File({ previewURL: null, isPDF: false });
    setPreviewsWorkPermit1File({ previewURL: null, isPDF: false });
    setPreviewsWorkPermit2File({ previewURL: null, isPDF: false });
    setPreviewsWorkPermit3File({ previewURL: null, isPDF: false });
    setPreviewsWorkPermit4File({ previewURL: null, isPDF: false });
    setPreviewsWorkPermit5File({ previewURL: null, isPDF: false });
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
