"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormPosition from "@/components/form/hr/position/FormPosition";
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
  positionNameTH: "",
  positionNameEN: "",
  positionStatus: "",
};

export default function PositionUpdate({ params: paramsPromise }) {
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
  const positionId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
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
          fetch(`/api/hr/position/${positionId}`, {
            method: "GET",
            headers: {
              "secret-token": SECRET_TOKEN,
            },
          }),
        ]);

      const branchData = await branchRes.json();
      if (branchRes.ok) {
        setBranch(branchData.branch || []);
      } else {
        toast.error(branchData.error);
      }

      const divisionData = await divisionRes.json();
      if (divisionRes.ok) {
        setDivision(divisionData.division || []);
      } else {
        toast.error(divisionData.error);
      }

      const departmentData = await departmentRes.json();
      if (departmentRes.ok) {
        setDepartment(departmentData.department || []);
      } else {
        toast.error(departmentData.error);
      }

      const positionData = await positionRes.json();
      if (positionRes.ok) {
        const position = positionData.position[0];
        setFormData(position);
      } else {
        toast.error(positionData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [positionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtereddivision = useMemo(() => {
    if (!formData.positionBranchId) return [];
    return division.filter(
      (d) =>
        d.divisionStatus === "Active" &&
        d.divisionBranchId == formData.positionBranchId
    );
  }, [formData.positionBranchId, division]);

  const isbranchselected = !!formData.positionBranchId;

  const filtereddepartment = useMemo(() => {
    if (!formData.positionBranchId && !formData.positionDivisionId) return [];
    return department.filter(
      (dep) =>
        dep.departmentStatus === "Active" &&
        dep.departmentBranchId == formData.positionBranchId &&
        dep.departmentDivisionId == formData.positionDivisionId
    );
  }, [formData.positionBranchId && formData.positionDivisionId, department]);

  const isbranchanddivisionselected = Boolean(
    formData.positionBranchId && formData.positionDivisionId
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
      formDataObject.append("positionUpdateBy", userId);

      try {
        const res = await fetch(`/api/hr/position/${positionId}`, {
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
            router.push("/position");
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
          toast.error(jsonData.error || "Error updating position");
        }
      } catch (error) {
        toast.error("Error updating position: " + error.message);
      }
    },
    [positionId, router, userId]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Position Update" />
      <Toaster position="top-right" />
      <FormPosition
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        filtereddivision={filtereddivision}
        isbranchselected={isbranchselected}
        filtereddepartment={filtereddepartment}
        isbranchanddivisionselected={isbranchanddivisionselected}
        branch={branch}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
