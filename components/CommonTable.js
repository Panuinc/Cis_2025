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
          wrapper: "min-h-full shadow-none border-2 border-dark border-dashed",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="h-14 text-sm bg-default text-dark border-2 border-dark border-dashed"
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={emptyContentText}>
          {(item) => (
            <TableRow key={item._index} className="border-2 border-dark border-dashed">
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
