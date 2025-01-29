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

const trainingStatusColorMap = {
  pendinghrapprove: "warning",
  pendingmdapprove: "primary",
  approvedsuccess: "success",
  cancel: "danger",
  hrcancel: "danger",
  mdcancel: "danger",
};

export default function TrainingList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employee?.employeeLevel === "User";
  const isUserDivision = userData?.divisionName;
  const isUserRole = userData?.roleName;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [training, setTraining] = useState([]);

  const [filterTrainingValue, setFilterTrainingValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Document Id", uid: "trainingName" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Document Id", uid: "trainingName" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "trainingCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "trainingUpdateAt" },
          { name: "Training Status", uid: "trainingStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const employeeId = userData?.employee?.employeeId;
        const response = await fetch(
          `/api/hr/training?employeeId=${employeeId}`,
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
        setTraining(data.training || []);
        // ลบการตั้งค่า subordinateIds ออก
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [isUserLevel, userData?.employee?.employeeId, userData?.userId]);

  const handleExport = useCallback(
    async (trainingId) => {
      try {
        const response = await fetch(`/api/hr/training/export/${trainingId}`, {
          method: "GET",
          headers: {
            "secret-token": process.env.NEXT_PUBLIC_SECRET_TOKEN,
            "user-id": userData?.userId,
          },
        });

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
    const { employeeFirstname, employeeLastname } = user;
    return employeeFirstname && employeeLastname
      ? `${employeeFirstname} ${employeeLastname}`
      : null;
  }, []);

  const renderChip = useCallback((status) => {
    const statusKey = (status || "").toLowerCase();
    const color = trainingStatusColorMap[statusKey] || "default";
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
        case "trainingName":
          return item.trainingName || null;
        case "trainingStatus":
          return renderChip(item.trainingStatus);
        case "createdBy":
          return getFullName(item.TrainingCreateBy);
        case "trainingCreateAt":
          return new Date(item.trainingCreateAt).toLocaleString();
        case "updatedBy":
          return getFullName(item.TrainingUpdateBy);
        case "trainingUpdateAt":
          return item.trainingUpdateAt
            ? new Date(item.trainingUpdateAt).toLocaleString()
            : null;
        case "actions": {
          const loggedInEmployeeId = userData?.employee?.employeeId;
          const isOwner =
            item.TrainingCreateBy.employeeId === loggedInEmployeeId;

          // Case 1: Owner sees all their requests and can update if status is PendingHrApprove
          const showUpdateOwner =
            isOwner && item.trainingStatus === "PendingHrApprove";

          // Case 3: HR Manager sees all requests but can only update if status is PendingHrApprove
          const isHRManager =
            userData?.divisionName === "บุคคล" &&
            userData?.roleName === "Manager";
          const showUpdateHRManager =
            isHRManager && item.trainingStatus === "PendingHrApprove";

          // Case 4: MD sees only requests with status PendingMdApprove and can update if status is PendingMdApprove
          const isMD =
            userData?.divisionName === "บริหาร" && userData?.roleName === "MD";
          const showUpdateMD =
            isMD && item.trainingStatus === "PendingMdApprove";

          const showUpdate =
            showUpdateOwner || showUpdateHRManager || showUpdateMD;

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
                      <Link href={`/training/${item.trainingId}`}>Update</Link>
                    </DropdownItem>
                  )}
                  <DropdownItem
                    key="export"
                    variant="flat"
                    color="warning"
                    onPress={() => handleExport(item.trainingId)}
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
    [getFullName, renderChip, handleExport, userData]
  );

  const debouncedSetFilterTrainingValue = useMemo(
    () =>
      debounce((value) => {
        setFilterTrainingValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterTrainingValue(val || "");
    },
    [debouncedSetFilterTrainingValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterTrainingValue
      ? training.filter((item) =>
          item.trainingName
            ?.toLowerCase()
            .includes(filterTrainingValue.toLowerCase())
        )
      : training;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [training, filterTrainingValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterTrainingValue.cancel();
    };
  }, [debouncedSetFilterTrainingValue]);

  return (
    <>
      <TopicHeader topic="Training List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterTrainingValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/training/create"
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
          emptyContentText="Training Not Found"
        />
      </div>
    </>
  );
}
