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
        // roleRes,
        siteRes,
        // divisionRes,
        // departmentRes,
        // positionRes,
        // parentRes,
        employmentRes,
      ] = await Promise.all([
        fetch(`/api/hr/branch`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
        // fetch(`/api/hr/role`, {
        //   method: "GET",
        //   headers: {
        //     "secret-token": SECRET_TOKEN,
        //   },
        // }),
        fetch(`/api/hr/site`, {
          method: "GET",
          headers: {
            "secret-token": SECRET_TOKEN,
          },
        }),
        // fetch(`/api/hr/division`, {
        //   method: "GET",
        //   headers: {
        //     "secret-token": SECRET_TOKEN,
        //   },
        // }),
        // fetch(`/api/hr/department`, {
        //   method: "GET",
        //   headers: {
        //     "secret-token": SECRET_TOKEN,
        //   },
        // }),
        // fetch(`/api/hr/position`, {
        //   method: "GET",
        //   headers: {
        //     "secret-token": SECRET_TOKEN,
        //   },
        // }),
        // fetch(`/api/hr/employee`, {
        //   method: "GET",
        //   headers: {
        //     "secret-token": SECRET_TOKEN,
        //   },
        // }),
        fetch(`/api/hr/employment/${employmentId}`, {
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

      const employmentData = await employmentRes.json();
      if (employmentRes.ok) {
        const employment = employmentData.employment[0];
        setFormData(employment);
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

  const filteredsite = useMemo(() => {
    if (!formData.employmentBranchId) return [];
    return site.filter(
      (site) =>
        site.siteStatus === "Active" &&
        site.siteBranchId === formData.employmentBranchId
    );
  }, [formData.employmentBranchId, site]);

  const isbranchselected = Boolean(formData.employmentBranchId);

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
      formDataObject.append("employmentUpdateBy", userId);

      try {
        const res = await fetch(`/api/hr/employment/${employmentId}`, {
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
            router.push("/employment");
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
    [employmentId, router, userId]
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
        // filtereddivision={filtereddivision}
        // filtereddepartment={filtereddepartment}
        // filteredposition={filteredposition}
        // filteredparent={filteredparent}
        isbranchselected={isbranchselected}
        // isbranchanddivisionselected={isbranchanddivisionselected}
        // isbranchanddivisionanddepartmentselected={isbranchanddivisionanddepartmentselected}
        branch={branch}
        // role={role}

        formData={formData}
        handleInputChange={handleInputChange}
        isUpdate={true}
        operatedBy={operatedBy}
      />
    </>
  );
}
