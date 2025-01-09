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
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
      <div className="flex items-center justify-between w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-start h-full p-2 gap-2 border-2 border-dark border-dashed">
          Rows per page:
          <select
            className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed bg-white rounded-xl"
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
          color="success"
          page={page}
          total={pages}
          onChange={onPageChange}
          className="flex items-center justify-center h-full p-2 gap-2 border-2 border-dark border-dashed"
        />
      </div>
    </div>
  );
}
