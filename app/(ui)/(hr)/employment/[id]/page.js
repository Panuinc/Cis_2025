"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormEmployment from "@/components/form/hr/employment/FormEmployment";
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
  employmentNumber: "",
  employmentCardNumber: "",
  employmentType: "",
  employmentBranchId: "",
  employmentSiteId: "",
  employmentDivisionId: "",
  employmentDepartmentId: "",
  employmentPositionId: "",
  employmentRoleId: "",
  employmentParentId: "",
  employmentStartWork: "",
  employmentPicture: "",
  employmentSignature: "",
  employmentEnterType: "",
  employmentPassportNumber: "",
  employmentPassportStartDate: "",
  employmentPassportEndDate: "",
  employmentPassportIssuedBy: "",
  employmentPlaceOfBirth: "",
  employmentEnterCheckPoint: "",
  employmentEnterDate: "",
  employmentImmigration: "",
  employmentTypeOfVisa: "",
  employmentVisaNumber: "",
  employmentVisaIssuedBy: "",
  employmentWorkPermitNumber: "",
  employmentWorkPermitStartDate: "",
  employmentWorkPermitEndDate: "",
  employmentWorkPermitIssuedBy: "",
  employmentSsoNumber: "",
  employmentSsoHospital: "",
  employmentWorkStatus: "",
};

export default function EmploymentUpdate({ params: paramsPromise }) {
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
  const employmentId = params.id;

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [role, setRole] = useState([]);
  const [site, setSite] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [parent, setParent] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [
        branchRes,
        roleRes,
        siteRes,
        divisionRes,
        departmentRes,
        positionRes,
        parentRes,
        employmentRes,
      ] = await Promise.all([
        fetch(`/api/hr/branch`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
        fetch(`/api/hr/role`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
        fetch(`/api/hr/site`, {
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
        fetch(`/api/hr/employee`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
        fetch(`/api/hr/employment/${employmentId}`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
      ]);

      // Branch
      const branchData = await branchRes.json();
      if (branchRes.ok) {
        const activeBranch = (branchData.branch || []).filter(
          (b) => b.branchStatus === "Active"
        );
        setBranch(activeBranch);
      } else {
        toast.error(branchData.error);
      }

      // Role
      const roleData = await roleRes.json();
      if (roleRes.ok) {
        const activeRole = (roleData.role || []).filter(
          (r) => r.roleStatus === "Active"
        );
        setRole(activeRole);
      } else {
        toast.error(roleData.error);
      }

      // Site
      const siteData = await siteRes.json();
      if (siteRes.ok) {
        const activeSite = (siteData.site || []).filter(
          (s) => s.siteStatus === "Active"
        );
        setSite(activeSite);
      } else {
        toast.error(siteData.error);
      }

      // Division
      const divisionData = await divisionRes.json();
      if (divisionRes.ok) {
        const activeDivision = (divisionData.division || []).filter(
          (d) => d.divisionStatus === "Active"
        );
        setDivision(activeDivision);
      } else {
        toast.error(divisionData.error);
      }

      // Department
      const departmentData = await departmentRes.json();
      if (departmentRes.ok) {
        const activeDepartment = (departmentData.department || []).filter(
          (dep) => dep.departmentStatus === "Active"
        );
        setDepartment(activeDepartment);
      } else {
        toast.error(departmentData.error);
      }

      // Position
      const positionData = await positionRes.json();
      if (positionRes.ok) {
        const activePosition = (positionData.position || []).filter(
          (p) => p.positionStatus === "Active"
        );
        setPosition(activePosition);
      } else {
        toast.error(positionData.error);
      }

      // Parent (เฉพาะ Manager)
      const parentData = await parentRes.json();
      if (parentRes.ok) {
        const activeParent = (parentData.employee || []).filter(
          (p) =>
            p.employeeStatus === "Active" &&
            p.employeeEmployment?.some(
              (emp) => emp?.EmploymentRoleId?.roleName === "Manager"
            )
        );
        setParent(activeParent);
      } else {
        toast.error(parentData.error);
      }

      // Employment ที่ต้องการแก้ไข
      const employmentData = await employmentRes.json();
      if (employmentRes.ok) {
        const employment = employmentData.employment[0];
        // ดึงค่า citizen ใส่ใน formData ด้วย
        setFormData({
          ...employment,
          employeeCitizen:
            employment.EmploymentEmployeeBy?.employeeCitizen || "",
        });
      } else {
        toast.error(employmentData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [employmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // filter site ตามสาขา
  const filteredsite = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return site.filter(
      (s) =>
        s.siteStatus === "Active" &&
        s.siteBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, site]);

  // filter division ตามสาขา
  const filtereddivision = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return division.filter(
      (d) =>
        d.divisionStatus === "Active" &&
        d.divisionBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, division]);

  const isbranchselected = Boolean(formData.employmentBranchId);

  // filter department ตามสาขา+division
  const filtereddepartment = useMemo(() => {
    if (!formData.employmentBranchId && !formData.employmentDivisionId) {
      return [];
    }
    return department.filter(
      (dep) =>
        dep.departmentStatus === "Active" &&
        dep.departmentBranchId == formData.employmentBranchId &&
        dep.departmentDivisionId == formData.employmentDivisionId
    );
  }, [formData.employmentBranchId, formData.employmentDivisionId, department]);

  // filter parent เฉพาะคนที่เป็น Manager ใน branch/division เดียวกัน
  const filteredparent = useMemo(() => {
    if (!formData.employmentBranchId && !formData.employmentDivisionId) {
      return [];
    }
    return parent.filter(
      (p) =>
        p.employeeStatus === "Active" &&
        p.employeeEmployment?.some(
          (emp) =>
            emp.employmentBranchId == formData.employmentBranchId &&
            emp.employmentDivisionId == formData.employmentDivisionId
        )
    );
  }, [formData.employmentBranchId, formData.employmentDivisionId, parent]);

  const isBranchAndDivisionSelected = Boolean(
    formData.employmentBranchId && formData.employmentDivisionId
  );

  // filter position ตาม branch+division+department
  const filteredposition = useMemo(() => {
    if (
      !formData.employmentBranchId &&
      !formData.employmentDivisionId &&
      !formData.employmentDepartmentId
    )
      return [];
    return position.filter(
      (pos) =>
        pos.positionStatus === "Active" &&
        pos.positionBranchId == formData.employmentBranchId &&
        pos.positionDivisionId == formData.employmentDivisionId &&
        pos.positionDepartmentId == formData.employmentDepartmentId
    );
  }, [
    formData.employmentBranchId,
    formData.employmentDivisionId,
    formData.employmentDepartmentId,
    position,
  ]);

  const isBranchAndDivisionAndDepartmentSelected = Boolean(
    formData.employmentBranchId &&
      formData.employmentDivisionId &&
      formData.employmentDepartmentId
  );

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value || null;
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
      formDataObject.append("employmentUpdateBy", userId);

      // เช็กสัญชาติของพนักงาน
      // ถ้าเป็น Thai ให้ส่ง request ด้วย method PUT
      // ถ้าเป็น Cambodian / Lao / Burmese / Vietnamese ให้ส่ง request ด้วย method PATCH
      let method = "PUT";
      if (
        ["Cambodian", "Lao", "Burmese", "Vietnamese"].includes(
          formData.employeeCitizen
        )
      ) {
        method = "PATCH";
      }

      try {
        const res = await fetch(`/api/hr/employment/${employmentId}`, {
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
          toast.error(jsonData.error || "Error updating employment");
        }
      } catch (error) {
        toast.error("Error updating employment: " + error.message);
      }
    },
    [employmentId, router, userId, formData.employeeCitizen]
  );

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Employment Update" />
      <Toaster position="top-right" />
      <FormEmployment
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        filteredsite={filteredsite}
        filtereddivision={filtereddivision}
        filtereddepartment={filtereddepartment}
        filteredposition={filteredposition}
        filteredparent={filteredparent}
        isbranchselected={isbranchselected}
        isBranchAndDivisionSelected={isBranchAndDivisionSelected}
        isBranchAndDivisionAndDepartmentSelected={
          isBranchAndDivisionAndDepartmentSelected
        }
        branch={branch}
        role={role}
        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
