"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import PaginationComponent from "@/components/PaginationComponent";

export default function CommonTable({
  columns,
  items,
  loading,
  renderCell,
  page,
  pages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  emptyContentText = "No Data",
}) {
  if (loading) {
    return <div>...Loading data...</div>;
  }

  return (
    <>
      <Table
        isHeaderSticky
        classNames={{
          wrapper: "min-h-full shadow-none bg-white dark:bg-dark",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="h-14 text-sm bg-primary text-white"
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={emptyContentText}>
          {(item) => (
            <TableRow key={item._index} className="border-b">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationComponent
        page={page}
        pages={pages}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}