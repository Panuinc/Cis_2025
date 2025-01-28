// app/(somewhere)/TrainingCreate.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TopicHeader from "@/components/form/TopicHeader";
import FormTraining from "@/components/form/hr/training/FormTraining"; // ไฟล์ Form UI
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

// ค่าเริ่มต้นของฟอร์ม
const DEFAULT_FORM_DATA = {
  trainingType: "",
  trainingName: "",
  trainingObjectives: "",
  trainingTargetGroup: "",

  trainingInstitutionsType: "",
  trainingStartDate: "",
  trainingEndDate: "",
  trainingInstitutions: "",
  trainingLecturer: "",

  trainingLocation: "",
  trainingPrice: "",
  trainingEquipmentPrice: "",
  trainingFoodPrice: "",
  trainingFarePrice: "",

  trainingOtherExpenses: "",
  trainingOtherPrice: "",
  // ค่า sum จะคำนวณอัตโนมัติ ไม่ให้ผู้ใช้แก้เอง
  trainingSumPrice: "",
  trainingReferenceDocument: "",
  trainingRemark: "",
  trainingRequireKnowledge: "",
};

export default function TrainingCreate() {
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

  const [sequentialMode, setSequentialMode] = useState(false);
  const [showEmployeeSection, setShowEmployeeSection] = useState(false);

  const formRef = useRef(null);

  //===================== useEffect สำหรับคำนวณ sum ====================

  useEffect(() => {
    // parse เป็น float ทั้งหมด (ถ้าเป็นช่องว่างให้กลายเป็น 0)
    const {
      trainingPrice = "0",
      trainingEquipmentPrice = "0",
      trainingFoodPrice = "0",
      trainingFarePrice = "0",
      trainingOtherPrice = "0",
      trainingSumPrice, // ไว้เช็คก่อนเซ็ตค่า
    } = formData;

    const sumNumber =
      parseFloat(trainingPrice || "0") +
      parseFloat(trainingEquipmentPrice || "0") +
      parseFloat(trainingFoodPrice || "0") +
      parseFloat(trainingFarePrice || "0") +
      parseFloat(trainingOtherPrice || "0");

    // ถ้าไม่เท่ากับของเดิม จึงค่อยเซ็ต (กัน setState ซ้ำไม่สิ้นสุด)
    if (sumNumber.toString() !== trainingSumPrice) {
      setFormData((prev) => ({
        ...prev,
        trainingSumPrice: sumNumber.toString(),
      }));
    }
  }, [
    formData.trainingPrice,
    formData.trainingEquipmentPrice,
    formData.trainingFoodPrice,
    formData.trainingFarePrice,
    formData.trainingOtherPrice,
    formData.trainingSumPrice,
  ]);

  //===================== handle input =====================
  const handleInputChange = useCallback(
    (field) => (e) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // เคลียร์ error เฉพาะ field เมื่อมีการเปลี่ยนแปลง
      setErrors((prevErr) => {
        if (prevErr[field]) {
          const { [field]: _, ...rest } = prevErr;
          return rest;
        }
        return prevErr;
      });
    },
    []
  );

  //===================== handle select employee =====================
  const handleSelect = useCallback((checked, empId) => {
    setSelectedIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, empId];
      } else {
        return prevSelected.filter((id) => id !== empId);
      }
    });
  }, []);

  //===================== handle submit =====================
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // สร้าง FormData จาก <form ref={formRef}>
      const formDataObject = new FormData(formRef.current);

      // เพิ่ม trainingCreateBy
      formDataObject.append("trainingCreateBy", userId);

      // เปลี่ยน selectedIds -> [{ trainingEmployeeEmployeeId: xxx }, ...]
      const trainingEmployeeArray = selectedIds.map((empId) => ({
        trainingEmployeeEmployeeId: empId,
      }));
      formDataObject.append(
        "trainingEmployee",
        JSON.stringify(trainingEmployeeArray)
      );

      try {
        const res = await fetch("/api/hr/training", {
          method: "POST",
          body: formDataObject,
          headers: { "secret-token": SECRET_TOKEN },
        });

        const jsonData = await res.json();
        if (res.ok) {
          toast.success(jsonData.message);
          setTimeout(() => {
            router.push("/training");
          }, 2000);
        } else {
          // ถ้าเกิด Error จาก Zod
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
          toast.error(jsonData.error || "Error creating training");
        }
      } catch (error) {
        toast.error("Error creating training: " + error.message);
      }
    },
    [router, userId, selectedIds]
  );

  //===================== handle clear/reset =====================
  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setSelectedIds([]);
    setErrors({});
  }, []);

  //===================== ตัวอย่าง fetchData ถ้าต้องการข้อมูล branch/employee =====================
  const fetchData = useCallback(async () => {
    try {
      // ตัวอย่าง fetch branch, site, division, department, parent, employee
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
        fetch(`/api/hr/employee`, {
          method: "GET",
          headers: { "secret-token": SECRET_TOKEN },
        }),
      ]);

      const branchData = await branchRes.json();
      if (branchRes.ok) {
        const activeBranch = (branchData.branch || []).filter(
          (b) => b.branchStatus === "Active"
        );
        setBranch(activeBranch);
      } else {
        toast.error(branchData.error);
      }

      const siteData = await siteRes.json();
      if (siteRes.ok) {
        const activeSite = (siteData.site || []).filter(
          (s) => s.siteStatus === "Active"
        );
        setSite(activeSite);
      } else {
        toast.error(siteData.error);
      }

      const divisionData = await divisionRes.json();
      if (divisionRes.ok) {
        const activeDivision = (divisionData.division || []).filter(
          (d) => d.divisionStatus === "Active"
        );
        setDivision(activeDivision);
      } else {
        toast.error(divisionData.error);
      }

      const departmentData = await departmentRes.json();
      if (departmentRes.ok) {
        const activeDepartment = (departmentData.department || []).filter(
          (dept) => dept.departmentStatus === "Active"
        );
        setDepartment(activeDepartment);
      } else {
        toast.error(departmentData.error);
      }

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //===================== ฟิลเตอร์ employee =====================
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

  //===================== render =====================
  return (
    <>
      <TopicHeader topic="Training Create" />
      <Toaster position="top-right" />

      <FormTraining
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelect={handleSelect}
        selectedIds={selectedIds}
        operatedBy={operatedBy}
        // props สำหรับฟิลเตอร์/ตารางเลือกพนักงาน
        branch={branch}
        site={site}
        division={division}
        department={department}
        parent={parent}
        employees={employees}
        filteredEmployees={filteredEmployees}
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
        sequentialMode={sequentialMode}
        setSequentialMode={setSequentialMode}
        showEmployeeSection={showEmployeeSection}
        setShowEmployeeSection={setShowEmployeeSection}
      />
    </>
  );
}
