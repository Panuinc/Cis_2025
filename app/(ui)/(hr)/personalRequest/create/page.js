"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormPersonalRequest from "@/components/form/hr/personalRequest/FormPersonalRequest";
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
  personalRequestDocumentId: "",
  personalRequestAmount: "",
  personalRequestBranchId: "",
  personalRequestDivisionId: "",

  personalRequestDepartmentId: "",
  personalRequestPositionId: "",
  personalRequestDesiredDate: "",
  personalRequestEmploymentType: "",
  personalRequestReasonForRequest: "",

  personalRequestReasonGender: "",
  personalRequestReasonAge: "",
  personalRequestReasonEducation: "",
  personalRequestReasonEnglishSkill: "",
  personalRequestReasonComputerSkill: "",

  personalRequestReasonOtherSkill: "",
  personalRequestReasonExperience: "",
};

export default function PersonalRequestCreate() {
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

  const amPosition = useMemo(
    () => `${userData?.positionNameTH || ""}`,
    [userData]
  );

  const amDepartment = useMemo(
    () => `${userData?.departmentName || ""}`,
    [userData]
  );

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [branchRes, divisionRes, departmentRes, positionRes] =
        await Promise.all([
          fetch(`/api/hr/branch`, {
            method: "GET",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
          }),
          fetch(`/api/hr/division`, {
            method: "GET",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
          }),
          fetch(`/api/hr/department`, {
            method: "GET",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
          }),
          fetch(`/api/hr/position`, {
            method: "GET",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
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

      const divisionData = await divisionRes.json();
      if (divisionRes.ok) {
        const activeDivision = (divisionData.division || []).filter(
          (division) => division.divisionStatus === "Active"
        );
        setDivision(activeDivision);
      } else {
        toast.error(divisionData.error);
      }

      const departmentData = await departmentRes.json();
      if (departmentRes.ok) {
        const activeDepartment = (departmentData.department || []).filter(
          (department) => department.departmentStatus === "Active"
        );
        setDepartment(activeDepartment);
      } else {
        toast.error(departmentData.error);
      }

      const positionData = await positionRes.json();
      if (positionRes.ok) {
        const activePosition = (positionData.position || []).filter(
          (position) => position.positionStatus === "Active"
        );
        setPosition(activePosition);
      } else {
        toast.error(positionData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtereddivision = useMemo(() => {
    if (!formData.personalRequestBranchId) return [];
    return division.filter(
      (division) =>
        division.divisionStatus === "Active" &&
        division.divisionBranchId == formData.personalRequestBranchId
    );
  }, [formData.personalRequestBranchId, division]);

  const isbranchselected = Boolean(formData.personalRequestBranchId);

  const filtereddepartment = useMemo(() => {
    if (!formData.personalRequestBranchId && !formData.personalRequestDivisionId) {
      return [];
    }
    return department.filter(
      (department) =>
        department.departmentStatus === "Active" &&
        department.departmentBranchId == formData.personalRequestBranchId &&
        department.departmentDivisionId == formData.personalRequestDivisionId
    );
  }, [formData.personalRequestBranchId, formData.personalRequestDivisionId, department]);

  const isBranchAndDivisionSelected = Boolean(
    formData.personalRequestBranchId && formData.personalRequestDivisionId
  );

  const filteredposition = useMemo(() => {
    if (
      !formData.personalRequestBranchId &&
      !formData.personalRequestDivisionId &&
      !formData.personalRequestDepartmentId
    )
      return [];
    return position.filter(
      (position) =>
        position.positionStatus === "Active" &&
        position.positionBranchId == formData.personalRequestBranchId &&
        position.positionDivisionId == formData.personalRequestDivisionId &&
        position.positionDepartmentId == formData.personalRequestDepartmentId
    );
  }, [
    formData.personalRequestBranchId,
    formData.personalRequestDivisionId,
    formData.personalRequestDepartmentId,
    position,
  ]);

  const isBranchAndDivisionAndDepartmentSelected = Boolean(
    formData.personalRequestBranchId &&
      formData.personalRequestDivisionId &&
      formData.personalRequestDepartmentId
  );

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
      formDataObject.append("personalRequestCreateBy", userId);

      try {
        const res = await fetch("/api/hr/personalRequest", {
          method: "POST",
          body: formDataObject,
          headers: { "secret-token": SECRET_TOKEN },
        });

        const jsonData = await res.json();
        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/personalRequest");
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
          toast.error(jsonData.error || "Error creating personalRequest");
        }
      } catch (error) {
        toast.error("Error creating personalRequest: " + error.message);
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
      <TopicHeader topic="PersonalRequest Create" />
      <Toaster position="top-right" />
      <FormPersonalRequest
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        filtereddivision={filtereddivision}
        filtereddepartment={filtereddepartment}
        filteredposition={filteredposition}
        isbranchselected={isbranchselected}
        isBranchAndDivisionSelected={isBranchAndDivisionSelected}
        isBranchAndDivisionAndDepartmentSelected={
          isBranchAndDivisionAndDepartmentSelected
        }
        branch={branch}
        formData={formData}
        handleInputChange={handleInputChange}
        operatedBy={operatedBy}
        amPosition={amPosition}
        amDepartment={amDepartment}
      />
    </>
  );
}
