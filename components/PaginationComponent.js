"use client";
import React from "react";
import { Pagination } from "@nextui-org/react";

export default function PaginationComponent({
  page,
  pages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
      <div className="flex items-center justify-between w-full h-full p-2 gap-2">
        <div className="flex flex-row items-center justify-start h-full p-2 gap-2">
          Rows per page:
          <select
            className="flex items-center justify-center h-full p-2 gap-2 border-2 bg-white dark:bg-dark rounded-xl"
            onChange={(e) => {
              onRowsPerPageChange(Number(e.target.value));
              onPageChange(1);
            }}
            value={rowsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          variant="light"
          page={page}
          total={pages}
          onChange={onPageChange}
          className="flex items-center justify-center h-full p-2 gap-2"
        />
      </div>
    </div>
  );
}