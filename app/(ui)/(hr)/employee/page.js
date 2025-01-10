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

const employeeStatusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function EmployeeList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employeeLevel === "User";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState([]);

  const [filterEmployeeValue, setFilterEmployeeValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Employee Title", uid: "employeeTitle" },
          { name: "Employee First Name", uid: "employeeFirstname" },
          { name: "Employee Last Name", uid: "employeeLastname" },
          { name: "Employee Nick Name", uid: "employeeNickname" },
          { name: "Employee Email", uid: "employeeEmail" },
          { name: "Employee Telephone", uid: "employeeTel" },
          { name: "Employee Id Card", uid: "employeeIdCard" },
          { name: "Employee Birthday", uid: "employeeBirthday" },
          { name: "Employee Citizen", uid: "employeeCitizen" },
          { name: "Employee Gender", uid: "employeeGender" },
          { name: "Employee Level", uid: "employeeLevel" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Employee Title", uid: "employeeTitle" },
          { name: "Employee First Name", uid: "employeeFirstname" },
          { name: "Employee Last Name", uid: "employeeLastname" },
          { name: "Employee Nick Name", uid: "employeeNickname" },
          { name: "Employee Email", uid: "employeeEmail" },
          { name: "Employee Telephone", uid: "employeeTel" },
          { name: "Employee Id Card", uid: "employeeIdCard" },
          { name: "Employee Birthday", uid: "employeeBirthday" },
          { name: "Employee Citizen", uid: "employeeCitizen" },
          { name: "Employee Gender", uid: "employeeGender" },
          { name: "Employee Level", uid: "employeeLevel" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "employeeCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "employeeUpdateAt" },
          { name: "Employee Status", uid: "employeeStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch("/api/hr/employee", {
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
        let filteredData = data.employee || [];

        if (isUserLevel) {
          filteredData = filteredData.filter(
            (item) => item.employeeStatus?.toLowerCase() === "active"
          );
        }

        setEmployee(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
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
    const color = employeeStatusColorMap[statusKey] || "default";
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
        case "employeeFirstname":
          return item.employeeFirstname || null;
        case "employeeStatus":
          return renderChip(item.employeeStatus);
        case "createdBy":
          return getFullName(item.EmployeeCreateBy);
        case "employeeCreateAt":
          return item.employeeCreateAt || null;
        case "updatedBy":
          return getFullName(item.EmployeeUpdateBy);
        case "employeeUpdateAt":
          return item.employeeUpdateAt || null;
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
                  <DropdownItem key="edit employee" variant="flat" color="warning">
                    <Link href={`/employee/${item.employeeId}`}>Update</Link>
                  </DropdownItem>
                  <DropdownItem key="edit user" variant="flat" color="warning">
                    <Link href={`/user/${item.employeeId}`}>User</Link>
                  </DropdownItem>
                  <DropdownItem key="edit employment" variant="flat" color="warning">
                    <Link href={`/employment/${item.employeeId}`}>Employment</Link>
                  </DropdownItem>
                  <DropdownItem key="edit empDocument" variant="flat" color="warning">
                    <Link href={`/employee/${item.employeeId}`}>Document</Link>
                  </DropdownItem>
                  <DropdownItem key="edit resume" variant="flat" color="warning">
                    <Link href={`/employee/${item.employeeId}`}>Resume</Link>
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

  const debouncedSetFilterEmployeeValue = useMemo(
    () =>
      debounce((value) => {
        setFilterEmployeeValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterEmployeeValue(val || "");
    },
    [debouncedSetFilterEmployeeValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterEmployeeValue
      ? employee.filter((item) =>
          item.employeeFirstname
            ?.toLowerCase()
            .includes(filterEmployeeValue.toLowerCase())
        )
      : employee;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [employee, filterEmployeeValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterEmployeeValue.cancel();
    };
  }, [debouncedSetFilterEmployeeValue]);

  return (
    <>
      <TopicHeader topic="Employee List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterEmployeeValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/employee/create"
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
          emptyContentText="Employee Not Found"
        />
      </div>
    </>
  );
}
