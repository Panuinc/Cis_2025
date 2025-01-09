"use client";
import React, { useEffect, useState, useMemo } from "react";
import TopicHeader from "@/components/form/TopicHeader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Add, Dot, Search } from "@/components/icons/icons";
import CommonTable from "@/components/CommonTable";
import {
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@nextui-org/react";

const branchStatusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function BranchList() {
  const { data: session } = useSession();
  const userData = session?.user || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branch, setBranch] = useState([]);

  const [filterBranchValue, setFilterBranchValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    if (userData?.employeeLevel === "User") {
      return [
        { name: "No.", uid: "index" },
        { name: "Branch Name", uid: "branchName" },
      ];
    }
    return [
      { name: "No.", uid: "index" },
      { name: "Branch Name", uid: "branchName" },
      { name: "Create By", uid: "createdBy" },
      { name: "Create At", uid: "branchCreateAt" },
      { name: "Update By", uid: "updatedBy" },
      { name: "Update At", uid: "branchUpdateAt" },
      { name: "Branch Status", uid: "branchStatus" },
      { name: "Management", uid: "actions" },
    ];
  }, [userData?.employeeLevel]);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch("/api/hr/branch", {
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

        let filteredData = data.branches || [];
        if (userData?.employeeLevel === "User") {
          filteredData = filteredData.filter(
            (item) => item.branchStatus?.toLowerCase() === "active"
          );
        }

        setBranch(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [userData?.employeeLevel]);

  const filteredItems = useMemo(() => {
    if (!filterBranchValue) return branch;
    return branch.filter((item) =>
      item.branchName?.toLowerCase().includes(filterBranchValue.toLowerCase())
    );
  }, [branch, filterBranchValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));
  }, [filteredItems, start, end]);

  const getFullName = (user) => {
    if (!user) return null;
    return user.employeeFirstname && user.employeeLastname
      ? `${user.employeeFirstname} ${user.employeeLastname}`
      : null;
  };

  const renderChip = (status) => {
    const statusKey = (status || "").toLowerCase();
    const color = branchStatusColorMap[statusKey] || "default";
    return (
      <Chip className="capitalize text-white" color={color} size="lg">
        {status || null}
      </Chip>
    );
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "index":
        return item._index;
      case "branchName":
        return item.branchName || null;
      case "branchStatus":
        return renderChip(item.branchStatus);
      case "createdBy":
        return getFullName(item.BranchCreateBy);
      case "branchCreateAt":
        return item.branchCreateAt || null;
      case "updatedBy":
        return getFullName(item.BranchUpdateBy);
      case "branchUpdateAt":
        return item.branchUpdateAt || null;
      case "actions":
        return (
          <div className="relative flex items-center justify-center w-full h-full p-2 gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="md" variant="light" color="warning">
                  <span>
                    <Dot />
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="edit" variant="flat" color="warning">
                  <Link href={`/hr/branch/${item.branchId}`}>Update</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <>
      <TopicHeader topic="Branch List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              value={filterBranchValue}
              onClear={() => setFilterBranchValue("")}
              onValueChange={(val) => setFilterBranchValue(val || "")}
            />
          </div>
          {(userData?.employeeLevel === "SuperAdmin" ||
            userData?.employeeLevel === "Admin") && (
            <Link
              href="/branch/create"
              className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
            >
              <Button size="lg" color="secondary">
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
          emptyContentText="Branch Not Found"
        />
      </div>
    </>
  );
}
