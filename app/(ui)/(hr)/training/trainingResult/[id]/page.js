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
  use,
} from "react";

const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN;

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
  trainingPrice: 0,
  trainingEquipmentPrice: 0,
  trainingFoodPrice: 0,
  trainingFarePrice: 0,

  trainingOtherExpenses: "",
  trainingOtherPrice: 0,
  trainingSumPrice: 0,
  trainingReferenceDocument: "",
  trainingRemark: "",
  trainingRequireKnowledge: "",
  trainingStatus: "",
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

  useEffect(() => {
    const {
      trainingPrice = 0,
      trainingEquipmentPrice = 0,
      trainingFoodPrice = 0,
      trainingFarePrice = 0,
      trainingOtherPrice = 0,
      trainingSumPrice,
    } = formData;

    const sumNumber =
      parseFloat(trainingPrice) +
      parseFloat(trainingEquipmentPrice) +
      parseFloat(trainingFoodPrice) +
      parseFloat(trainingFarePrice) +
      parseFloat(trainingOtherPrice);

    if (sumNumber !== parseFloat(trainingSumPrice)) {
      setFormData((prev) => ({
        ...prev,
        trainingSumPrice: sumNumber,
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

  const isHRManager = useMemo(() => {
    return (
      userData?.divisionName === "บุคคล" && userData?.roleName === "Manager"
    );
  }, [userData]);

  const isMD = useMemo(() => {
    return userData?.divisionName === "บริหาร" && userData?.roleName === "MD";
  }, [userData]);

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

  const handleSelect = useCallback((checked, empId) => {
    setSelectedIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, empId];
      } else {
        return prevSelected.filter((id) => id !== empId);
      }
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formDataObject = new FormData(formRef.current);

      formDataObject.append("trainingUpdateBy", userId);

      const trainingEmployeeArray = selectedIds.map((empId) => ({
        trainingEmployeeEmployeeId: empId,
      }));
      formDataObject.append(
        "trainingEmployee",
        JSON.stringify(trainingEmployeeArray)
      );

      const trainingEmployeeCheckInArray = selectedIds.map((empId) => ({
        trainingEmployeeCheckInEmployeeId: empId,
        trainingEmployeeCheckInTrainingDate: formData.trainingStartDate
          ? new Date(formData.trainingStartDate)
          : null,

        trainingEmployeeCheckInMorningCheck: null,
        trainingEmployeeCheckInAfterNoonCheck: null,
      }));
      formDataObject.append(
        "trainingEmployeeCheckIn",
        JSON.stringify(trainingEmployeeCheckInArray)
      );

      formDataObject.append("selectedIds", JSON.stringify(selectedIds));

      try {
        const res = await fetch(
          `/api/hr/training/${trainingId}?action=update`,
          {
            method: "PUT",
            body: formDataObject,
            headers: {
              "secret-token": SECRET_TOKEN,
            },
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
    [trainingId, router, userId, selectedIds, formData.trainingStartDate]
  );

  //
  const handleHrApprove = async () => {
    const formDataObject = new FormData(formRef.current);
    formDataObject.set("trainingStatus", "PendingMdApprove");
    formDataObject.append("trainingReasonHrApproveBy", userId);
    try {
      const res = await fetch(
        `/api/hr/training/${trainingId}?action=hrApprove`,
        {
          method: "PUT",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }
      );
      const jsonData = await res.json();
      if (res.ok) {
        toast.success(jsonData.message);
        router.push("/training");
      } else {
        toast.error(jsonData.error || "Error approving request");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleHrReject = async () => {
    const formDataObject = new FormData(formRef.current);
    formDataObject.set("trainingStatus", "HrCancel");
    formDataObject.append("trainingReasonHrApproveBy", userId);
    try {
      const res = await fetch(
        `/api/hr/training/${trainingId}?action=hrApprove`,
        {
          method: "PUT",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }
      );
      const jsonData = await res.json();
      if (res.ok) {
        toast.success("Request rejected successfully");
        router.push("/training");
      } else {
        toast.error(jsonData.error || "Error rejecting request");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleMdApprove = async () => {
    const formDataObject = new FormData(formRef.current);
    formDataObject.set("trainingStatus", "ApprovedSuccess");
    formDataObject.append("trainingReasonMdApproveBy", userId);
    try {
      const res = await fetch(
        `/api/hr/training/${trainingId}?action=mdApprove`,
        {
          method: "PUT",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }
      );
      const jsonData = await res.json();
      if (res.ok) {
        toast.success(jsonData.message);
        router.push("/training");
      } else {
        toast.error(jsonData.error || "Error approving request");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleMdReject = async () => {
    const formDataObject = new FormData(formRef.current);
    formDataObject.set("trainingStatus", "MdCancel");
    formDataObject.append("trainingReasonMdApproveBy", userId);
    try {
      const res = await fetch(
        `/api/hr/training/${trainingId}?action=mdApprove`,
        {
          method: "PUT",
          body: formDataObject,
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }
      );
      const jsonData = await res.json();
      if (res.ok) {
        toast.success("Request rejected successfully");
        router.push("/training");
      } else {
        toast.error(jsonData.error || "Error rejecting request");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  //

  const handleClear = useCallback(() => {
    if (formRef.current) formRef.current.reset();
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
    setSelectedIds([]);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [
        branchRes,
        siteRes,
        divisionRes,
        departmentRes,
        parentRes,
        employeeRes,
        trainingRes,
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
        fetch(`/api/hr/training/${trainingId}`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
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

      const trainingData = await trainingRes.json();
      if (trainingRes.ok) {
        const training = trainingData.training[0];
        setFormData(training);

        const existingEmployeeIds = training.employeeTrainingTraining.map(
          (et) => et.trainingEmployeeEmployeeId
        );
        setSelectedIds(existingEmployeeIds);
      } else {
        toast.error(trainingData.error);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }, [trainingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <TopicHeader topic="Training Result Update" />
      <Toaster position="top-right" />
      <FormTrainingResult
        formRef={formRef}
        onSubmit={handleSubmit}
        onClear={handleClear}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelect={handleSelect}
        selectedIds={selectedIds}
        operatedBy={operatedBy}
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
        isUpdate={true}

        isHRManager={isHRManager}
        isMD={isMD}
        onHrApprove={handleHrApprove}
        onHrReject={handleHrReject}
        onMdApprove={handleMdApprove}
        onMdReject={handleMdReject}

      />
    </>
  );
}
