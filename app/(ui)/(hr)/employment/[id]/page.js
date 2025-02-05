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
  employmentPicture: null,
  employmentSignature: null,
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
      `${userData?.employee?.employeeFirstnameTH || ""} ${
        userData?.employee?.employeeLastnameTH || ""
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

  const [previews, setPreviews] = useState({ employmentPicture: null });

  const formRef = useRef(null);
  const signatureRef = useRef();

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

      const branchData = await branchRes.json();
      if (branchRes.ok) {
        const activeBranch = (branchData.branch || []).filter(
          (branch) => branch.branchStatus === "Active"
        );
        setBranch(activeBranch);
      } else {
        toast.error(branchData.error);
      }

      const roleData = await roleRes.json();
      if (roleRes.ok) {
        const activeRole = (roleData.role || []).filter(
          (role) => role.roleStatus === "Active"
        );
        setRole(activeRole);
      } else {
        toast.error(roleData.error);
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

      const positionData = await positionRes.json();
      if (positionRes.ok) {
        const activePosition = (positionData.position || []).filter(
          (position) => position.positionStatus === "Active"
        );
        setPosition(activePosition);
      } else {
        toast.error(positionData.error);
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

      const employmentData = await employmentRes.json();
      if (employmentRes.ok) {
        const employment = employmentData.employment[0];
        setFormData({
          ...employment,
          employeeCitizen:
            employment.EmploymentEmployeeBy?.employeeCitizen || "",
        });
        if (employment.employmentPicture) {
          setPreviews((prev) => ({
            ...prev,
            employmentPicture: `/images/user_picture/${employment.employmentPicture}`,
          }));
        }
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

  const filteredposition = useMemo(() => {
    if (
      !formData.employmentBranchId &&
      !formData.employmentDivisionId &&
      !formData.employmentDepartmentId
    )
      return [];
    return position.filter(
      (position) =>
        position.positionStatus === "Active" &&
        position.positionBranchId == formData.employmentBranchId &&
        position.positionDivisionId == formData.employmentDivisionId &&
        position.positionDepartmentId == formData.employmentDepartmentId
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

  const handleInputChange = (field) => (e) => {
    const value =
      field === "employmentPicture" ? e.target.files[0] : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "employmentPicture") {
      const file = e.target.files[0];
      if (file) {
        setPreviews((prev) => ({
          ...prev,
          [field]: URL.createObjectURL(file),
        }));
      }
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      let signatureBlob = null;
      if (signatureRef.current && !signatureRef.current.isEmpty()) {
        signatureBlob = await new Promise((resolve) => {
          const canvas = signatureRef.current.getTrimmedCanvas();
          canvas.toBlob((blob) => {
            resolve(blob);
          });
        });
      }

      const formDataObject = new FormData(formRef.current);
      formDataObject.append("employmentUpdateBy", userId);

      if (signatureBlob) {
        formDataObject.append(
          "employmentSignature",
          signatureBlob,
          "signature.png"
        );
      }

      if (formData.employmentPicture) {
        formDataObject.append("employmentPicture", formData.employmentPicture);
      }

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
    [
      employmentId,
      router,
      userId,
      formData.employeeCitizen,
      formData.employmentPicture,
    ]
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
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        previews={previews}
        isUpdate={true}
        operatedBy={operatedBy}
        signatureRef={signatureRef}
      />
    </>
  );
}
