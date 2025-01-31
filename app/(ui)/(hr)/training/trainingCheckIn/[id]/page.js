"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormTrainingCheckIn from "@/components/form/hr/training/FormTrainingCheckIn";
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
  trainingEmployeeCheckIn: [],
};

export default function TrainingCheckIntUpdate({ params: paramsPromise }) {
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

  const handleTrainingEmployeeCheckInMorningCheckChange = useCallback(
    (checkInId, newMorningCheck) => {
      setFormData((prev) => ({
        ...prev,
        trainingEmployeeCheckIn: prev.trainingEmployeeCheckIn.map((checkIn) =>
          checkIn.trainingEmployeeCheckInId === checkInId
            ? { ...checkIn, trainingEmployeeCheckInMorningCheck: newMorningCheck }
            : checkIn
        ),
      }));
    },
    []
  );

  const handleTrainingEmployeeCheckInAfterNoonCheckChange = useCallback(
    (checkInId, newAfterNoonCheck) => {
      setFormData((prev) => ({
        ...prev,
        trainingEmployeeCheckIn: prev.trainingEmployeeCheckIn.map((checkIn) =>
          checkIn.trainingEmployeeCheckInId === checkInId
            ? { ...checkIn, trainingEmployeeCheckInAfterNoonCheck: newAfterNoonCheck }
            : checkIn
        ),
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!Array.isArray(formData.trainingEmployeeCheckIn)) {
        console.error(
          "trainingEmployeeCheckIn is not an array:",
          formData.trainingEmployeeCheckIn
        );
        toast.error("Invalid training employee check-in data");
        return;
      }

      const formDataPayload = new FormData();
      formDataPayload.append("trainingId", trainingId);
      formDataPayload.append("trainingPreTest", formData.trainingPreTest);
      formDataPayload.append("trainingPostTest", formData.trainingPostTest);
      formDataPayload.append(
        "trainingPictureLink",
        formData.trainingPictureLink
      );
      formDataPayload.append(
        "trainingEmployeeCheckIn",
        JSON.stringify(formData.trainingEmployeeCheckIn)
      );

      // หากมีไฟล์ที่ต้องอัพโหลด ให้จัดการตามต้องการ (ถ้ามี)

      try {
        const res = await fetch(
          `/api/hr/training/trainingCheckIn/${trainingId}`,
          {
            method: "PUT",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
            body: formDataPayload,
          }
        );

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
    [
      trainingId,
      router,
      formData.trainingEmployeeCheckIn,
      formData.trainingPictureLink,
      formData.trainingPreTest,
      formData.trainingPostTest,
    ]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const trainingRes = await fetch(
        `/api/hr/training/trainingCheckIn/${trainingId}`,
        {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }
      );

      const trainingData = await trainingRes.json();
      if (trainingRes.ok) {
        const training = trainingData.training[0];
        console.log("Fetched training data:", training);

        setFormData({
          trainingPreTest: training.trainingPreTest || "",
          trainingPostTest: training.trainingPostTest || "",
          trainingPictureLink: training.trainingPictureLink || "",
          trainingEmployeeCheckIn:
            training.employeeTrainingCheckInTraining?.map((checkIn) => ({
              trainingEmployeeCheckInId: checkIn.trainingEmployeeCheckInId,
              trainingEmployeeCheckInMorningCheck: checkIn.trainingEmployeeCheckInMorningCheck
                ? new Date(checkIn.trainingEmployeeCheckInMorningCheck).toISOString().slice(0, 16)
                : "",
              trainingEmployeeCheckInAfterNoonCheck: checkIn.trainingEmployeeCheckInAfterNoonCheck
                ? new Date(checkIn.trainingEmployeeCheckInAfterNoonCheck).toISOString().slice(0, 16)
                : "",
              TrainingEmployeeCheckInEmployeeId: checkIn.TrainingEmployeeCheckInEmployeeId,
            })) || [],
        });
      } else {
        toast.error(trainingData.error);
      }

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
      <TopicHeader topic="Training Check In Update" />
      <Toaster position="top-right" />
      <FormTrainingCheckIn
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        formData={formData}
        handleInputChange={handleInputChange}
        operatedBy={operatedBy}
        employees={employees}
        filteredEmployees={employees}
        isUpdate={true}
        handleTrainingEmployeeCheckInMorningCheckChange={handleTrainingEmployeeCheckInMorningCheckChange}
        handleTrainingEmployeeCheckInAfterNoonCheckChange={handleTrainingEmployeeCheckInAfterNoonCheckChange}
      />
    </>
  );
}
