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

const positionStatusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function PositionList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employee?.employeeLevel === "User";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState([]);

  const [filterPositionValue, setFilterPositionValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Division Name", uid: "divisionName" },
          { name: "Department Name", uid: "departmentName" },
          { name: "Position Name TH", uid: "positionNameTH" },
          { name: "Position Name EN", uid: "positionNameEN" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Division Name", uid: "divisionName" },
          { name: "Department Name", uid: "departmentName" },
          { name: "Position Name TH", uid: "positionNameTH" },
          { name: "Position Name EN", uid: "positionNameEN" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "positionCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "positionUpdateAt" },
          { name: "Position Status", uid: "positionStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch("/api/hr/position", {
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
        let filteredData = data.position || [];

        if (isUserLevel) {
          filteredData = filteredData.filter(
            (item) => item.positionStatus?.toLowerCase() === "active"
          );
        }

        setPosition(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [isUserLevel]);

  const getFullName = useCallback((user) => {
    if (!user) return null;
    const { employeeFirstnameTH, employeeLastnameTH } = user;
    return employeeFirstnameTH && employeeLastnameTH
      ? `${employeeFirstnameTH} ${employeeLastnameTH}`
      : null;
  }, []);

  const renderChip = useCallback((status) => {
    const statusKey = (status || "").toLowerCase();
    const color = positionStatusColorMap[statusKey] || "default";
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
          return item.PositionBranchId?.branchName || null;
        case "divisionName":
          return item.PositionDivisionId?.divisionName || null;
        case "departmentName":
          return item.PositionDepartmentId?.departmentName || null;
        case "positionNameTH":
          return item.positionNameTH || null;
        case "positionNameEN":
          return item.positionNameEN || null;
        case "positionStatus":
          return renderChip(item.positionStatus);
        case "createdBy":
          return getFullName(item.PositionCreateBy);
        case "positionCreateAt":
          return item.positionCreateAt || null;
        case "updatedBy":
          return getFullName(item.PositionUpdateBy);
        case "positionUpdateAt":
          return item.positionUpdateAt || null;
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
                    <Link href={`/position/${item.positionId}`}>Update</Link>
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

  const debouncedSetFilterPositionValue = useMemo(
    () =>
      debounce((value) => {
        setFilterPositionValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterPositionValue(val || "");
    },
    [debouncedSetFilterPositionValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterPositionValue
      ? position.filter((item) =>
          item.positionNameTH
            ?.toLowerCase()
            .includes(filterPositionValue.toLowerCase())
        )
      : position;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [position, filterPositionValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterPositionValue.cancel();
    };
  }, [debouncedSetFilterPositionValue]);

  return (
    <>
      <TopicHeader topic="Position List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterPositionValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/position/create"
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
          emptyContentText="Position Not Found"
        />
      </div>
    </>
  );
}
