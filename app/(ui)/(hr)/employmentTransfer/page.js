"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormEmploymentTransfer from "@/components/form/hr/employmentTransfer/FormEmploymentTransfer";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

const DEFAULT_FORM_DATA = {
  employmentBranchId: "",
  employmentSiteId: "",
  employmentDivisionId: "",
  employmentDepartmentId: "",
  employmentParentId: "",
};

export default function EmploymentTransferPage() {
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

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [site, setSite] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parent, setParent] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const [filterBranch, setFilterBranch] = useState("");
  const [filterSite, setFilterSite] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterParent, setFilterParent] = useState("");

  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [
        branchRes,
        siteRes,
        divisionRes,
        departmentRes,
        parentRes,
        employeeRes,
      ] = await Promise.all([
        fetch(`/api/hr/branch`, {
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
        fetch(`/api/hr/employee`, {
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

      const siteData = await siteRes.json();
      if (siteRes.ok) {
        const activeSite = (siteData.site || []).filter(
          (site) => site.siteStatus === "Active"
        );
        setSite(activeSite);
      } else {
        toast.error(siteData.error);
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

      const parentData = await parentRes.json();
      if (parentRes.ok) {
        const activeParent = (parentData.employee || []).filter(
          (parent) =>
            parent.employeeStatus === "Active" &&
            parent.employeeEmployment?.some(
              (emp) => emp?.EmploymentRoleId?.roleName === "Manager"
            )
        );
        setParent(activeParent);
      } else {
        toast.error(parentData.error);
      }

      const employeeData = await employeeRes.json();
      if (employeeRes.ok) {
        const activeEmployee = (employeeData.employee || []).filter(
          (employee) => employee.employeeStatus === "Active"
        );
        setEmployees(activeEmployee);
      } else {
        toast.error(employeeData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredsite = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return site.filter(
      (site) =>
        site.siteStatus === "Active" &&
        site.siteBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, site]);

  const filtereddivision = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return division.filter(
      (division) =>
        division.divisionStatus === "Active" &&
        division.divisionBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, division]);

  const isbranchselected = Boolean(formData.employmentBranchId);

  const filtereddepartment = useMemo(() => {
    if (!formData.employmentBranchId && !formData.employmentDivisionId) {
      return [];
    }
    return department.filter(
      (department) =>
        department.departmentStatus === "Active" &&
        department.departmentBranchId == formData.employmentBranchId &&
        department.departmentDivisionId == formData.employmentDivisionId
    );
  }, [formData.employmentBranchId, formData.employmentDivisionId, department]);

  const filteredparent = useMemo(() => {
    if (!formData.employmentBranchId && !formData.employmentDivisionId) {
      return [];
    }
    return parent.filter(
      (parent) =>
        parent.employeeStatus === "Active" &&
        parent.employeeEmployment?.some(
          (emp) =>
            emp.employmentBranchId == formData.employmentBranchId &&
            emp.employmentDivisionId == formData.employmentDivisionId
        )
    );
  }, [formData.employmentBranchId, formData.employmentDivisionId, parent]);

  const isBranchAndDivisionSelected = Boolean(
    formData.employmentBranchId && formData.employmentDivisionId
  );

  const handleSelect = useCallback((checked, empId) => {
    setSelectedIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, empId];
      } else {
        return prevSelected.filter((id) => id !== empId);
      }
    });
  }, []);

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

      const bulkData = selectedIds.map((empId) => ({
        employmentId: Number(empId),
        employmentBranchId: Number(formData.employmentBranchId) || null,
        employmentSiteId: Number(formData.employmentSiteId) || null,
        employmentDivisionId: Number(formData.employmentDivisionId) || null,
        employmentDepartmentId: Number(formData.employmentDepartmentId) || null,
        employmentParentId: Number(formData.employmentParentId) || null,
        employmentUpdateBy: Number(userId) || null,
      }));

      if (bulkData.length === 0) {
        toast.error("Please select at least one employee before submit.");
        return;
      }

      try {
        const res = await fetch("/api/hr/employmentTransfer", {
          method: "POST",
          headers: {
            "secret-token": SECRET_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bulkData),
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
    [router, userId, formData, selectedIds]
  );

  const handleClear = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setSelectedIds([]);
    setErrors({});
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const employment = emp.employeeEmployment?.[0] || {};
      const matchBranch = filterBranch
        ? employment.employmentBranchId === Number(filterBranch)
        : true;
      const matchSite = filterSite
        ? employment.employmentSiteId === Number(filterSite)
        : true;
      const matchDivision = filterDivision
        ? employment.employmentDivisionId === Number(filterDivision)
        : true;
      const matchDepartment = filterDepartment
        ? employment.employmentDepartmentId === Number(filterDepartment)
        : true;
      const matchParent = filterParent
        ? employment.employmentParentId === Number(filterParent)
        : true;
      return (
        matchBranch &&
        matchSite &&
        matchDivision &&
        matchDepartment &&
        matchParent
      );
    });
  }, [
    employees,
    filterBranch,
    filterSite,
    filterDivision,
    filterDepartment,
    filterParent,
  ]);

  return (
    <>
      <TopicHeader topic="Employment Transfer" />
      <Toaster position="top-right" />
      <FormEmploymentTransfer
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        handleSelect={handleSelect}
        handleInputChange={handleInputChange}
        errors={errors}
        formData={formData}
        selectedIds={selectedIds}
        branch={branch}
        site={site}
        division={division}
        department={department}
        parent={parent}
        employees={employees}
        operatedBy={operatedBy}
        filteredsite={filteredsite}
        filtereddivision={filtereddivision}
        filtereddepartment={filtereddepartment}
        filteredparent={filteredparent}
        isbranchselected={isbranchselected}
        isBranchAndDivisionSelected={isBranchAndDivisionSelected}
        
        filterBranch={filterBranch}
        setFilterBranch={setFilterBranch}
        filterSite={filterSite}
        setFilterSite={setFilterSite}
        filterDivision={filterDivision}
        setFilterDivision={setFilterDivision}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterParent={filterParent}
        setFilterParent={setFilterParent}
        filteredEmployees={filteredEmployees}
      />
    </>
  );
}
