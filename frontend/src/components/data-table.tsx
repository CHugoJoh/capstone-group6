"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { getReportDataById } from "@/app/api"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { title?: string; description?: string; [key: string]: any }, 
TValue>({ columns, data, }
  : DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null)
  const [reportData, setReportData] = React.useState<Record<string, any> | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchColumns = ["title", "description", "tags", "site"]
      return searchColumns.some((col) => {
        const value = row.getValue<string>(col)
        return value?.toString().toLowerCase().includes(filterValue.toLowerCase())
      })
    },
  })

  // Fetch report details when dialog opens
  React.useEffect(() => {
    if (!selectedId) return

    setLoading(true)
    setError(null)
    setReportData(null)

    getReportDataById(String(selectedId))
      .then((data) => setReportData(data))
      .catch((err) => setError(err.message ?? "Failed to load report"))
      .finally(() => setLoading(false))
  }, [selectedId])

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <div className="flex items-center py-4 ml-5">
          <Input
            placeholder="Search reports..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedId(row.original.number)} // <-- use ID
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div>
          <DataTablePagination table={table} />
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={!!selectedId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedId(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {loading
                ? "Loading..."
                : reportData?.title ?? reportData?.report_name ?? "Details"}
            </DialogTitle>
            <DialogDescription>
              {loading
                ? "Fetching incident details..."
                : reportData?.description ?? reportData?.details ?? ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2">
            {loading && <p>Loading report data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading &&
              !error &&
              reportData &&
              Object.entries(reportData).map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong>
                    {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                  </strong>{" "}
                  {String(value)}
                </p>
              ))}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
