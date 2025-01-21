"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// หรือถ้าคุณไว้คนละ path เช่น
import FormEmploymentTransfer from "@/components/form/hr/employmentTransfer/FormEmploymentTransfer";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

export default function EmploymentTransferPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // userId สำหรับอัปเดต
  const userId = session?.user?.userId || null;

  // state สำหรับเก็บรายการ employee
  const [employees, setEmployees] = useState([]);
  // state สำหรับ checkbox
  const [selectedIds, setSelectedIds] = useState([]);

  // state สำหรับ dropdown ต่าง ๆ
  const [branchList, setBranchList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [parentList, setParentList] = useState([]);

  // state สำหรับค่าที่จะอัปเดต (ที่ผู้ใช้เลือก)
  const [transferData, setTransferData] = useState({
    branchId: "",
    siteId: "",
    divisionId: "",
    departmentId: "",
    parentId: "",
  });

  // โหลดข้อมูลพนักงาน + dropdown ต่าง ๆ
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
            // สมมติว่าอยากได้เฉพาะ manager (parent) ก็กรองเอง หรือจะใช้ endpoint อื่นก็ได้
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

        // parentData จะรวม employee ทั้งหมด
        // สมมติว่าต้องการ filter เฉพาะ manager
        if (parentRes.ok) {
          const allEmp = parentData.employee || [];
          // ตัวอย่าง: filter คนที่เป็น Manager
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

  // ฟังก์ชัน handle เลือก checkbox
  const handleSelect = (checked, empId) => {
    setSelectedIds((prev) => {
      if (checked) {
        return [...prev, empId];
      } else {
        return prev.filter((id) => id !== empId);
      }
    });
  };

  // ฟังก์ชันเปลี่ยน dropdown
  const handleTransferChange = (field) => (e) => {
    const value = e.target?.value || e;
    setTransferData((prev) => ({ ...prev, [field]: value }));
  };

  // ฟังก์ชัน submit
  const handleSubmit = async () => {
    if (!userId) {
      toast.error("No userId found (Please login)");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    // สร้าง array ที่จะส่งไป
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
        // หรือจะ router.push / router.refresh ก็ได้
      } else {
        toast.error(data.error || "Error on Bulk Transfer");
      }
    } catch (error) {
      toast.error("Fetch error: " + error.message);
    }
  };

  // ฟิลเตอร์เฉพาะ status=Active (ถ้าต้องการ)
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
