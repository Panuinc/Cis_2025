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
  pendinghrapprove: "secondary",
  pendingmdapprove: "success",
  approvedsuccess: "success",
  cancel: "danger",
  managercancel: "danger",
  hrcancel: "danger",
  mdcancel: "danger",
};

export default function PersonalRequestList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employee?.employeeLevel === "User";
  const isUserDivision = userData?.divisionName;
  const isUserRole = userData?.roleName;

  const [subordinateIds, setSubordinateIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalRequest, setPersonalRequest] = useState([]);

  const [filterPersonalRequestValue, setFilterPersonalRequestValue] =
    useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Document Id", uid: "personalRequestDocumentId" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Document Id", uid: "personalRequestDocumentId" },
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
      const employeeId = userData?.employee?.employeeId;
      const response = await fetch(
        `/api/hr/personalRequest?employeeId=${employeeId}`,
        {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
            "user-id": userData?.userId,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setPersonalRequest(data.personalRequest || []);
      setSubordinateIds(data.subordinateIds || []); // เก็บ subordinateIds ใน state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPersonalRequest();
}, [isUserLevel, userData?.employee?.employeeId, userData?.userId]);

  const handleExport = useCallback(
    async (personalRequestId) => {
      try {
        const response = await fetch(
          `/api/hr/personalRequest/export/${personalRequestId}`,
          {
            method: "GET",
            headers: {
              "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
              "user-id": userData?.userId,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Export failed with status:",
            response.status,
            errorText
          );
          throw new Error("Failed to export PDF");
        }

        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);
        window.open(blobURL);
      } catch (error) {
        console.error("Export PDF error:", error);
      }
    },
    [userData?.userId]
  );

  const getFullName = useCallback((user) => {
    if (!user) return null;
    const { employeeFirstnameTH, employeeLastnameTH } = user;
    return employeeFirstnameTH && employeeLastnameTH
      ? `${employeeFirstnameTH} ${employeeLastnameTH}`
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
          return new Date(item.personalRequestCreateAt).toLocaleString();
        case "updatedBy":
          return getFullName(item.PersonalRequestUpdateBy);
        case "personalRequestUpdateAt":
          return item.personalRequestUpdateAt
            ? new Date(item.personalRequestUpdateAt).toLocaleString()
            : null;
        case "actions": {
          const loggedInEmployeeId = userData?.employee?.employeeId;
          const isOwner =
            item.PersonalRequestCreateBy.employeeId === loggedInEmployeeId;
          const isSubordinate = subordinateIds.includes(
            item.PersonalRequestCreateBy.employeeId
          ); // ตรวจสอบว่าเป็นลูกน้องของตนเองหรือไม่

          // Case 1: Owner sees all their requests and can update if status is PendingManagerApprove
          const showUpdateOwner =
            isOwner && item.personalRequestStatus === "PendingManagerApprove";

          // Case 2: Parent sees subordinates' requests and can update if status is PendingManagerApprove
          const showUpdateParent =
            isSubordinate &&
            item.personalRequestStatus === "PendingManagerApprove";

          // Case 3: HR Manager sees all requests but can only update if status is PendingHrApprove or PendingManagerApprove for their subordinates
          const isHRManager =
            userData?.divisionName === "บุคคล" &&
            userData?.roleName === "Manager";
          const showUpdateHRManager =
            (isHRManager &&
              item.personalRequestStatus === "PendingHrApprove") ||
            (isHRManager &&
              isSubordinate &&
              item.personalRequestStatus === "PendingManagerApprove");

          // Case 4: MD sees only requests with status PendingMdApprove and can update if status is PendingMdApprove
          const isMD =
            userData?.divisionName === "บริหาร" && userData?.roleName === "MD";
          const showUpdateMD =
            isMD && item.personalRequestStatus === "PendingMdApprove";

          const showUpdate =
            showUpdateOwner ||
            showUpdateParent ||
            showUpdateHRManager ||
            showUpdateMD;

          return (
            <div className="relative flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="md" variant="light" color="warning">
                    <Setting />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {showUpdate && (
                    <DropdownItem key="edit" variant="flat" color="warning">
                      <Link href={`/personalRequest/${item.personalRequestId}`}>
                        Update
                      </Link>
                    </DropdownItem>
                  )}
                  <DropdownItem
                    key="export"
                    variant="flat"
                    color="warning"
                    onPress={() => handleExport(item.personalRequestId)}
                  >
                    Export PDF
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        }
        default:
          return item[columnKey];
      }
    },
    [getFullName, renderChip, handleExport, userData, subordinateIds]
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
