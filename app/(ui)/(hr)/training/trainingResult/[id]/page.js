"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormTrainingResult from "@/components/form/hr/training/FormTrainingResult";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  use
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

const DEFAULT_FORM_DATA = {
  trainingPreTest: "",
  trainingPostTest: "",
  trainingPictureLink: "",
  trainingEmployee: [],
};

export default function TrainingResultUpdate({ params: paramsPromise }) {
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
  const trainingId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

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

  // ฟังก์ชันจัดการการเปลี่ยนแปลงผลการฝึกอบรม
  const handleTrainingEmployeeResultChange = useCallback((employeeId, newResult) => {
    setFormData((prev) => ({
      ...prev,
      trainingEmployee: prev.trainingEmployee.map((emp) =>
        emp.trainingEmployeeId === employeeId
          ? { ...emp, trainingEmployeeResult: newResult }
          : emp
      ),
    }));
  }, []);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงลิงก์ใบรับรอง
  const handleTrainingEmployeeCertificateChange = useCallback((employeeId, file) => {
    // อัปโหลดไฟล์และอัปเดตลิงก์ใบรับรอง
    if (!file) return;

    const uploadCertificate = async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/hr/training/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        });

        const jsonData = await res.json();

        if (res.ok) {
          const url = jsonData.url;
          setFormData((prev) => ({
            ...prev,
            trainingEmployee: prev.trainingEmployee.map((emp) =>
              emp.trainingEmployeeId === employeeId
                ? { ...emp, trainingEmployeeCertificateLink: url }
                : emp
            ),
          }));
          toast.success("Certificate uploaded successfully");
        } else {
          toast.error(jsonData.error || "Error uploading certificate");
        }
      } catch (error) {
        console.error("File upload failed:", error);
        toast.error("File upload failed");
      }
    };

    uploadCertificate();
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);

      // เนื่องจากเราใช้ input แบบ text สำหรับ trainingPictureLink จึงไม่ต้องแปลงเป็น FormData
      // ดังนั้นเราจะสร้าง object สำหรับส่งไปยัง API
      const trainingEmployeeArray = formData.trainingEmployee.map((emp) => ({
        trainingEmployeeId: emp.trainingEmployeeId,
        trainingEmployeeResult: emp.trainingEmployeeResult || "Not_Pass",
        trainingEmployeeCertificateLink:
          emp.trainingEmployeeCertificateLink || "",
      }));

      const payload = {
        trainingId: parseInt(trainingId, 10),
        trainingPreTest: formData.trainingPreTest,
        trainingPostTest: formData.trainingPostTest,
        trainingPictureLink: formData.trainingPictureLink,
        trainingEmployee: trainingEmployeeArray,
      };

      try {
        const res = await fetch(`/api/hr/training/trainingResult/${trainingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "secret-token": SECRET_TOKEN,
          },
          body: JSON.stringify(payload),
        });

        const jsonData = await res.json();

        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/training");
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

            const errorMessages = jsonData.details.map(
              (err) => `${err.field.join(".")} : ${err.message}`
            );
            toast.error(errorMessages.join("\n"));
          } else {
            toast.error(jsonData.error || "Error updating training");
          }
        }
      } catch (error) {
        toast.error("Error updating training: " + error.message);
      }
    },
    [trainingId, router, formData.trainingEmployee, formData.trainingPictureLink, formData.trainingPreTest, formData.trainingPostTest]
  );

  // ฟังก์ชันเคลียร์ฟอร์ม
  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = useCallback(async () => {
    try {
      const trainingRes = await fetch(`/api/hr/training/trainingResult/${trainingId}`, {
        method: "GET",
        headers: {
          "secret-token": SECRET_TOKEN,
        },
      });

      const trainingData = await trainingRes.json();
      if (trainingRes.ok) {
        const training = trainingData.training[0];
        setFormData({
          trainingPreTest: training.trainingPreTest || "",
          trainingPostTest: training.trainingPostTest || "",
          trainingPictureLink: training.trainingPictureLink || "",
          trainingEmployee: training.employeeTrainingTraining.map((et) => ({
            trainingEmployeeId: et.trainingEmployeeId,
            trainingEmployeeResult: et.trainingEmployeeResult,
            trainingEmployeeCertificateLink: et.trainingEmployeeCertificateLink,
            TrainingEmployeeEmployeeId: et.TrainingEmployeeEmployeeId, // เพิ่มข้อมูลนี้
          })),
        });
      } else {
        toast.error(trainingData.error);
      }

      // ดึงข้อมูลพนักงานทั้งหมด
      const employeeRes = await fetch(`/api/hr/employee`, {
        method: "GET",
        headers: { "secret-token": SECRET_TOKEN },
      });
      const employeeData = await employeeRes.json();
      if (employeeRes.ok) {
        const activeEmployee = (employeeData.employee || []).filter(
          (emp) => emp.employeeStatus === "Active"
        );
        setEmployees(activeEmployee);
      } else {
        toast.error(employeeData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [trainingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <TopicHeader topic="Training Result Update" />
      <Toaster position="top-right" />
      <FormTrainingResult
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        formData={formData}
        handleInputChange={handleInputChange}
        operatedBy={operatedBy}
        employees={employees}
        filteredEmployees={employees} // เนื่องจากเราไม่ต้องการฟิลเตอร์เพิ่มเติม
        isUpdate={true}
        handleTrainingEmployeeResultChange={handleTrainingEmployeeResultChange} // ส่งฟังก์ชันไปยัง FormTrainingResult
        handleTrainingEmployeeCertificateChange={handleTrainingEmployeeCertificateChange} // ส่งฟังก์ชันไปยัง FormTrainingResult
      />
    </>
  );
}
