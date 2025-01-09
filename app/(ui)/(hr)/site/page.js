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

const siteStatusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function SiteList() {
  const { data: session } = useSession();
  const userData = session?.user || {};
  const isUserLevel = userData?.employeeLevel === "User";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [site, setSite] = useState([]);

  const [filterSiteValue, setFilterSiteValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(() => {
    return isUserLevel
      ? [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Site Name", uid: "siteName" },
        ]
      : [
          { name: "No.", uid: "index" },
          { name: "Branch Name", uid: "branchName" },
          { name: "Site Name", uid: "siteName" },
          { name: "Create By", uid: "createdBy" },
          { name: "Create At", uid: "siteCreateAt" },
          { name: "Update By", uid: "updatedBy" },
          { name: "Update At", uid: "siteUpdateAt" },
          { name: "Site Status", uid: "siteStatus" },
          { name: "Management", uid: "actions" },
        ];
  }, [isUserLevel]);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await fetch("/api/hr/site", {
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
        let filteredData = data.site || [];

        if (isUserLevel) {
          filteredData = filteredData.filter(
            (item) => item.siteStatus?.toLowerCase() === "active"
          );
        }

        setSite(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
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
    const color = siteStatusColorMap[statusKey] || "default";
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
          return item.SiteBranchId?.branchName || null;
        case "siteName":
          return item.siteName || null;
        case "siteStatus":
          return renderChip(item.siteStatus);
        case "createdBy":
          return getFullName(item.SiteCreateBy);
        case "siteCreateAt":
          return item.siteCreateAt || null;
        case "updatedBy":
          return getFullName(item.SiteUpdateBy);
        case "siteUpdateAt":
          return item.siteUpdateAt || null;
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
                    <Link href={`/site/${item.siteId}`}>Update</Link>
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

  const debouncedSetFilterSiteValue = useMemo(
    () =>
      debounce((value) => {
        setFilterSiteValue(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (val) => {
      debouncedSetFilterSiteValue(val || "");
    },
    [debouncedSetFilterSiteValue]
  );

  const { paginatedItems, pages } = useMemo(() => {
    const filtered = filterSiteValue
      ? site.filter((item) =>
          item.siteName?.toLowerCase().includes(filterSiteValue.toLowerCase())
        )
      : site;

    const calculatedPages = Math.ceil(filtered.length / rowsPerPage) || 1;
    const currentPage = page > calculatedPages ? calculatedPages : page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const items = filtered.slice(start, end).map((item, i) => ({
      ...item,
      _index: start + i + 1,
    }));

    return { paginatedItems: items, pages: calculatedPages };
  }, [site, filterSiteValue, page, rowsPerPage]);

  useEffect(() => {
    return () => {
      debouncedSetFilterSiteValue.cancel();
    };
  }, [debouncedSetFilterSiteValue]);

  return (
    <>
      <TopicHeader topic="Site List" />
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              isClearable
              placeholder="Search"
              size="lg"
              variant="bordered"
              startContent={<Search />}
              onClear={() => setFilterSiteValue("")}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {(userData?.employee?.employeeLevel === "SuperAdmin" ||
            userData?.employee?.employeeLevel === "Admin") && (
            <Link
              href="/site/create"
              className="flex items-center justify-end w-full h-full p-2 gap-2 border-2 border-dark border-dashed"
            >
              <Button size="lg" color="default">
                <Add /> Add New
              </Button>
            </Link>
          )}
        </div>
        {error && (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
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
          emptyContentText="Site Not Found"
        />
      </div>
    </>
  );
}
