"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { analyzeReports } from "@/app/api"
import { selectedRows } from "../app/table/columns"
import {
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
import { getColumns } from "../app/table/columns"
import { ReportData } from "../app/data/ReportData"

interface DataTableProps {
  data: ReportData[]
}

export function DataTable({ data }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [reportData, setReportData] = React.useState<Record<string, any> | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const columns = React.useMemo(() => getColumns(setSelectedId), [])
  const [aiResult, setAiResult] = React.useState<string | null>(null);

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
      const searchableColumns = ["number", "unit", "factory", "location", "what_happened"]
      return searchableColumns.some(col => {
        const value = row.getValue<string>(col)
        return value?.toString().toLowerCase().includes(filterValue.toLowerCase())
      })
    },
  })

  React.useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    setError(null)
    setReportData(null)

    getReportDataById(selectedId)
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
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedId(row.original.number)}
                >
                  {row.getVisibleCells().map(cell => (
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

        <Button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white ml-5 mb-5"
          onClick={async () => {
            if (!selectedRows.size) {
              return alert("Please select some reports first.");
            }

            const reports = data.filter(row => selectedRows.has(row.number));

            try {
              console.log("Analyzing reports:", reports);
              const response = await analyzeReports(reports); // <-- pass full objects
              setAiResult(response.message); // store result in React state
            } catch (err) {
              console.error(err);
              alert("Failed to analyze reports.");
            }
          }}
        >
          Analyze Selected Reports
        </Button>

      </div>

      <Dialog
        open={!!selectedId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedId(null)
        }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {loading ? "Loading..." : reportData?.number ?? "Report Details"}
            </DialogTitle>
            <DialogDescription>
              {loading ? "Fetching report details..." : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2">
            {loading && <p>Loading report data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {reportData &&
              Object.entries(reportData).map(([key, value]) => (
                <p key={key} className="text-sm">
                  <strong>
                    {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}:
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

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-3xl mt-10">
        <h3 className="font-semibold mb-3">AI Analysis Results:</h3>
        {aiResult ? (
          <p className="whitespace-pre-wrap">{aiResult}</p>
        ) : (
          <p className="text-gray-500">No analysis yet.</p>
        )}
      </div>
    </>
  )
}
