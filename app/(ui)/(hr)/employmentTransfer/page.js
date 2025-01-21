"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import FormEmploymentTransfer from "@/components/form/hr/employmentTransfer/FormEmploymentTransfer";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

export default function EmploymentTransferPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.userId || null;

  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [branchList, setBranchList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [parentList, setParentList] = useState([]);

  const [transferData, setTransferData] = useState({
    branchId: "",
    siteId: "",
    divisionId: "",
    departmentId: "",
    parentId: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [
          employeeRes,
          branchRes,
          siteRes,
          divisionRes,
          departmentRes,
          parentRes,
        ] = await Promise.all([
          fetch(`/api/hr/employee`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
          fetch(`/api/hr/branch`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
          fetch(`/api/hr/site`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
          fetch(`/api/hr/division`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
          fetch(`/api/hr/department`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
          fetch(`/api/hr/employee`, {
            method: "GET",
            headers: { "secret-token": SECRET_TOKEN },
          }),
        ]);

        const [
          employeeData,
          branchData,
          siteData,
          divisionData,
          departmentData,
          parentData,
        ] = await Promise.all([
          employeeRes.json(),
          branchRes.json(),
          siteRes.json(),
          divisionRes.json(),
          departmentRes.json(),
          parentRes.json(),
        ]);

        if (employeeRes.ok) {
          setEmployees(employeeData.employee || []);
        } else {
          toast.error(employeeData.error || "Cannot fetch employees");
        }

        if (branchRes.ok) {
          setBranchList(branchData.branch || []);
        } else {
          toast.error(branchData.error || "Cannot fetch branch");
        }

        if (siteRes.ok) {
          setSiteList(siteData.site || []);
        } else {
          toast.error(siteData.error || "Cannot fetch site");
        }

        if (divisionRes.ok) {
          setDivisionList(divisionData.division || []);
        } else {
          toast.error(divisionData.error || "Cannot fetch division");
        }

        if (departmentRes.ok) {
          setDepartmentList(departmentData.department || []);
        } else {
          toast.error(departmentData.error || "Cannot fetch department");
        }

        if (parentRes.ok) {
          const allEmp = parentData.employee || [];
          const managers = allEmp.filter((emp) =>
            emp.employeeEmployment?.some(
              (em) => em.EmploymentRoleId?.roleName === "Manager"
            )
          );
          setParentList(managers);
        } else {
          toast.error(parentData.error || "Cannot fetch parent data");
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    })();
  }, []);

  const handleSelect = (checked, empId) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...prev, empId];
      } else {
        return prev.filter((id) => id !== empId);
      }
    });
  };

  const handleTransferChange = (field) => (e) => {
    const value = e.target?.value || e;
    setTransferData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("No userId found (Please login)");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    const payload = selectedIds.map((empId) => ({
      employmentId: empId,
      employmentBranchId: parseInt(transferData.branchId, 10),
      employmentSiteId: parseInt(transferData.siteId, 10),
      employmentDivisionId: parseInt(transferData.divisionId, 10),
      employmentDepartmentId: parseInt(transferData.departmentId, 10),
      employmentParentId: parseInt(transferData.parentId, 10),
      employmentUpdateBy: parseInt(userId, 10),
    }));

    try {
      const res = await fetch("/api/hr/employmentTransfer", {
        method: "POST",
        headers: {
          "secret-token": SECRET_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Bulk Transfer success");
      } else {
        toast.error(data.error || "Error on Bulk Transfer");
      }
    } catch (error) {
      toast.error("Fetch error: " + error.message);
    }
  };

  const activeBranch = useMemo(
    () => branchList.filter((b) => b.branchStatus === "Active"),
    [branchList]
  );
  const activeSite = useMemo(
    () => siteList.filter((s) => s.siteStatus === "Active"),
    [siteList]
  );
  const activeDivision = useMemo(
    () => divisionList.filter((d) => d.divisionStatus === "Active"),
    [divisionList]
  );
  const activeDepartment = useMemo(
    () => departmentList.filter((dep) => dep.departmentStatus === "Active"),
    [departmentList]
  );
  const activeManagers = useMemo(
    () => parentList.filter((p) => p.employeeStatus === "Active"),
    [parentList]
  );

  return (
    <>
      <Toaster position="top-right" />
      <FormEmploymentTransfer
        employees={employees}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        transferData={transferData}
        handleTransferChange={handleTransferChange}
        handleSubmit={handleSubmit}
        activeBranch={activeBranch}
        activeSite={activeSite}
        activeDivision={activeDivision}
        activeDepartment={activeDepartment}
        activeManagers={activeManagers}
      />
    </>
  );
}
