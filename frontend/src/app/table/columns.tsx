// columns.ts
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReportData } from "../data/ReportData"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const selectedRows: Set<string> = new Set();

export const getColumns = (setSelectedId: (id: string) => void): ColumnDef<ReportData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
          if (value) {
            table.getRowModel().rows.forEach(row => selectedRows.add(row.original.number));
          } else {
            table.getRowModel().rows.forEach(row => selectedRows.delete(row.original.number));
          }
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          if (value) {
            selectedRows.add(row.original.number);
          } else {
            selectedRows.delete(row.original.number);
          }
        }}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()} // prevent row click
      />
    ),
  },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "number", header: "Number" },
  { accessorKey: "unit", header: "Unit" },
  { accessorKey: "factory", header: "Factory" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "where_happened", header: "Where Happened" },
  {
    accessorKey: "what_happened",
    header: "What Happened",
    cell: ({ getValue }) => (
      <div className="max-w-[300px] truncate">{getValue() as string}</div>
    )
  },
  { accessorKey: "reported_by", header: "Reported By" },
  { accessorKey: "responsible", header: "Responsible" },
  { accessorKey: "state", header: "State" },
  { accessorKey: "report_from", header: "Report From" },
  {
    accessorKey: "when_happened",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        When Happened
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="text-center w-full">{getValue() as string}</div>
    )
  },
  { accessorKey: "area", header: "Area" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "team", header: "Team" },
  { accessorKey: "reported_by_group", header: "Reported by Group" },
  { accessorKey: "risk_type", header: "Risk Type" },
]
