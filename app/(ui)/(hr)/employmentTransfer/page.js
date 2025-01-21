"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    use,
  } from "react";
  
// สมมติว่า import Component ของคุณเอง
import TopicHeader from "@/components/form/TopicHeader";
import FormEmploymentTransfer from "@/components/form/hr/employmentTransfer/FormEmploymentTransfer";

// หรือโค้ด icons ที่คุณมี
import { Cancel, Database } from "@/components/icons/icons";

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
  const router = useRouter();

  // ดึง userId จาก session
  const userData = session?.user || {};
  const userId = userData?.userId;

  // State
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [site, setSite] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parent, setParent] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]); // สำหรับ checkbox
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const formRef = useRef(null);

  // ชื่อผู้ใช้งาน (Operated By)
  const operatedBy = useMemo(() => {
    return `${userData?.employee?.employeeFirstname || ""} ${
      userData?.employee?.employeeLastname || ""
    }`.trim();
  }, [userData]);

  // ฟังก์ชันดึงข้อมูลจาก API
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

      // branch
      const branchData = await branchRes.json();
      if (branchRes.ok) {
        const activeBranch = (branchData.branch || []).filter(
          (b) => b.branchStatus === "Active"
        );
        setBranch(activeBranch);
      } else {
        toast.error(branchData.error || "Error fetching branch");
      }

      // site
      const siteData = await siteRes.json();
      if (siteRes.ok) {
        const activeSite = (siteData.site || []).filter(
          (s) => s.siteStatus === "Active"
        );
        setSite(activeSite);
      } else {
        toast.error(siteData.error || "Error fetching site");
      }

      // division
      const divisionData = await divisionRes.json();
      if (divisionRes.ok) {
        const activeDivision = (divisionData.division || []).filter(
          (d) => d.divisionStatus === "Active"
        );
        setDivision(activeDivision);
      } else {
        toast.error(divisionData.error || "Error fetching division");
      }

      // department
      const departmentData = await departmentRes.json();
      if (departmentRes.ok) {
        const activeDepartment = (departmentData.department || []).filter(
          (dept) => dept.departmentStatus === "Active"
        );
        setDepartment(activeDepartment);
      } else {
        toast.error(departmentData.error || "Error fetching department");
      }

      // parent (Manager)
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
        toast.error(parentData.error || "Error fetching parent");
      }

      // employees (ทั้งหมด)
      const employeeData = await employeeRes.json();
      if (employeeRes.ok) {
        const activeEmployee = (employeeData.employee || []).filter(
          (employee) => employee.employeeStatus === "Active"
        );
        setEmployees(activeEmployee);
      } else {
        toast.error(employeeData.error || "Error fetching employees");
      }
    } catch (error) {
      toast.error("Error fetching data");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ฟิลเตอร์ Site ด้วย Branch
  const filteredsite = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return site.filter(
      (s) =>
        s.siteStatus === "Active" &&
        s.siteBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, site]);

  // ฟิลเตอร์ Division ด้วย Branch
  const filtereddivision = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return division.filter(
      (d) =>
        d.divisionStatus === "Active" &&
        d.divisionBranchId == formData.employmentBranchId
    );
  }, [formData.employmentBranchId, division]);

  // ฟิลเตอร์ Department ด้วย Branch + Division
  const filtereddepartment = useMemo(() => {
    if (!formData.employmentBranchId || !formData.employmentDivisionId) {
      return [];
    }
    return department.filter(
      (dept) =>
        dept.departmentStatus === "Active" &&
        dept.departmentBranchId == formData.employmentBranchId &&
        dept.departmentDivisionId == formData.employmentDivisionId
    );
  }, [formData.employmentBranchId, formData.employmentDivisionId, department]);

  // ฟิลเตอร์ Parent ด้วย Branch + Division
  const filteredparent = useMemo(() => {
    if (!formData.employmentBranchId || !formData.employmentDivisionId) {
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

  const isbranchselected = Boolean(formData.employmentBranchId);
  const isBranchAndDivisionSelected = Boolean(
    formData.employmentBranchId && formData.employmentDivisionId
  );

  // handleSelect checkbox
  const handleSelect = useCallback((checked, empId) => {
    setSelectedIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, empId];
      } else {
        return prevSelected.filter((id) => id !== empId);
      }
    });
  }, []);

  // handleInputChange
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

  // handleSubmit (**ส่ง JSON**)
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // สร้าง payload เป็น Array ของข้อมูลที่ต้องการ
      // โดย loop จาก selectedIds
      const bulkData = selectedIds.map((empId) => ({
        employmentId: Number(empId), // แปลงเป็น number ถ้า empId เป็น string
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
          body: JSON.stringify(bulkData), // ส่งอาเรย์เป็น JSON
        });

        const jsonData = await res.json();
        if (res.ok) {
          toast.success(jsonData.message || "Update successful!");
          // ตัวอย่าง: กลับไปหน้า /branch หลัง 2 วิ
          setTimeout(() => {
            router.push("/branch");
          }, 2000);
        } else {
          // ถ้ามี validation error
          if (jsonData.details) {
            const fieldErrorObj = jsonData.details.reduce((acc, err) => {
              // zod จะบอก path เป็น array; สมมติ err.path[0] = index, err.path[1] = field
              // ต้อง handle ซับซ้อนนิดนึง
              // หรืออาจจะเป็น object error ทั่วไป
              return acc;
            }, {});
            setErrors(fieldErrorObj);
          }
          toast.error(jsonData.error || "Error updating data");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
        console.error(error);
      }
    },
    [router, userId, formData, selectedIds]
  );

  // handleClear
  const handleClear = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setSelectedIds([]);
    setErrors({});
  }, []);

  return (
    <>
      <TopicHeader topic="Employment Transfer" />
      <Toaster position="top-right" />
      {/* 
        FormEmploymentTransfer คือ component UI
        ที่รับ props ของ state/handler ต่าง ๆ 
      */}
      <FormEmploymentTransfer
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        handleSelect={handleSelect}
        handleInputChange={handleInputChange}
        // States
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
        // Derived
        filteredsite={filteredsite}
        filtereddivision={filtereddivision}
        filtereddepartment={filtereddepartment}
        filteredparent={filteredparent}
        isbranchselected={isbranchselected}
        isBranchAndDivisionSelected={isBranchAndDivisionSelected}
      />
    </>
  );
}
