"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import TopicHeader from "@/components/form/TopicHeader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Add, Search, Setting } from "@/components/icons/icons";
import CommonTable from "@/components/CommonTable";
import debounce from "lodash.debounce";
import {
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@nextui-org/react";

const departmentStatusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function DepartmentList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employee?.employeeLevel === "User";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState([]);

  const [filterDepartmentValue, setFilterDepartmentValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Division Name", uid: "divisionName" },
          { name: "Department Name", uid: "departmentName" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Division Name", uid: "divisionName" },
          { name: "Department Name", uid: "departmentName" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "departmentCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "departmentUpdateAt" },
          { name: "Department Status", uid: "departmentStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch("/api/hr/department", {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const data = await response.json();
        let filteredData = data.department || [];

        if (isUserLevel) {
          filteredData = filteredData.filter(
            (item) => item.departmentStatus?.toLowerCase() === "active"
          );
        }

        setDepartment(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [isUserLevel]);

  const getFullName = useCallback((user) => {
    if (!user) return null;
    const { employeeFirstname, employeeLastname } = user;
    return employeeFirstname && employeeLastname
      ? `${employeeFirstname} ${employeeLastname}`
      : null;
  }, []);

  const renderChip = useCallback((status) => {
    const statusKey = (status || "").toLowerCase();
    const color = departmentStatusColorMap[statusKey] || "default";
    return (
      <Chip
        className="capitalize text-white border-2 border-dark border-dashed"
        color={color}
        size="lg"
      >
        {status || null}
      </Chip>
    );
  }, []);

  const renderCell = useCallback(
    (item, columnKey) => {
      switch (columnKey) {
        case "index":
          return item._index;
        case "branchName":
          return item.DepartmentBranchId?.branchName || null;
        case "divisionName":
          return item.DepartmentDivisionId?.divisionName || null;
        case "departmentName":
          return item.departmentName || null;
        case "departmentStatus":
          return renderChip(item.departmentStatus);
        case "createdBy":
          return getFullName(item.DepartmentCreateBy);
        case "departmentCreateAt":
          return item.departmentCreateAt || null;
        case "updatedBy":
          return getFullName(item.DepartmentUpdateBy);
        case "departmentUpdateAt":
          return item.departmentUpdateAt || null;
        case "actions":
          return (
            <div className="relative flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="md" variant="light" color="warning">
                    <Setting />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="edit" variant="flat" color="warning">
                    <Link href={`/department/${item.departmentId}`}>
                      Update
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return item[columnKey];
      }
    },
    [getFullName, renderChip]
  );

  const debouncedSetFilterDepartmentValue = useMemo(
    () =>
      debounce((value) => {
        setFilterDepartmentValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterDepartmentValue(val || "");
    },
    [debouncedSetFilterDepartmentValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterDepartmentValue
      ? department.filter((item) =>
          item.departmentName
            ?.toLowerCase()
            .includes(filterDepartmentValue.toLowerCase())
        )
      : department;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [department, filterDepartmentValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterDepartmentValue.cancel();
    };
  }, [debouncedSetFilterDepartmentValue]);

  return (
    <>
      <TopicHeader topic="Department List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterDepartmentValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/department/create"
              className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
            >
              <Button size="lg" color="default">
                <Add /> Add New
              </Button>
            </Link>
          )}
        </div>
        <CommonTable
          columns={columns}
          items={paginatedItems}
          loading={loading}
          renderCell={renderCell}
          page={page}
          pages={pages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          emptyContentText="Department Not Found"
        />
      </div>
    </>
  );
}
