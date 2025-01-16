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

const personalRequestStatusColorMap = {
  pendingmanagerapprove: "warning",
  cancel: "danger",
};

export default function PersonalRequestList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employee?.employeeLevel === "User";
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalRequest, setPersonalRequest] = useState([]);

  const [filterPersonalRequestValue, setFilterPersonalRequestValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "PersonalRequest Document Id", uid: "personalRequestDocumentId" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "PersonalRequest Document Id", uid: "personalRequestDocumentId" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "personalRequestCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "personalRequestUpdateAt" },
          { name: "PersonalRequest Status", uid: "personalRequestStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchPersonalRequest = async () => {
      try {
        const response = await fetch("/api/hr/personalRequest", {
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
        let filteredData = data.personalRequest || [];

        if (isUserLevel) {
          filteredData = filteredData.filter(
            (item) => item.personalRequestStatus?.toLowerCase() === "pendingmanagerapprove"
          );
        }

        setPersonalRequest(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalRequest();
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
    const color = personalRequestStatusColorMap[statusKey] || "default";
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
        case "personalRequestDocumentId":
          return item.personalRequestDocumentId || null;
        case "personalRequestStatus":
          return renderChip(item.personalRequestStatus);
        case "createdBy":
          return getFullName(item.PersonalRequestCreateBy);
        case "personalRequestCreateAt":
          return item.personalRequestCreateAt || null;
        case "updatedBy":
          return getFullName(item.PersonalRequestUpdateBy);
        case "personalRequestUpdateAt":
          return item.personalRequestUpdateAt || null;
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
                    <Link href={`/personalRequest/${item.personalRequestId}`}>Update</Link>
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

  const debouncedSetFilterPersonalRequestValue = useMemo(
    () =>
      debounce((value) => {
        setFilterPersonalRequestValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterPersonalRequestValue(val || "");
    },
    [debouncedSetFilterPersonalRequestValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterPersonalRequestValue
      ? personalRequest.filter((item) =>
          item.personalRequestDocumentId
            ?.toLowerCase()
            .includes(filterPersonalRequestValue.toLowerCase())
        )
      : personalRequest;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [personalRequest, filterPersonalRequestValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterPersonalRequestValue.cancel();
    };
  }, [debouncedSetFilterPersonalRequestValue]);

  return (
    <>
      <TopicHeader topic="PersonalRequest List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterPersonalRequestValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/personalRequest/create"
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
          emptyContentText="PersonalRequest Not Found"
        />
      </div>
    </>
  );
}
