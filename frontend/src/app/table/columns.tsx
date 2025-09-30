"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReportData } from "../data/ReportData"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<ReportData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  { accessorKey: "number", header: "Number" },
  { accessorKey: "unit", header: "Unit" },
  { accessorKey: "factory", header: "Factory" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "where_happened", header: "Where Happened" },
  { accessorKey: "what_happened", header: "What Happened" },
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: "area", header: "Area" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "sub_category", header: "Sub-Category" },
  { accessorKey: "team", header: "Team" },
  { accessorKey: "worker_type", header: "Worker Type" },
  { accessorKey: "work_context", header: "Work Context" },
  { accessorKey: "injury_type", header: "Injury Type" },
  { accessorKey: "reported_by_group", header: "Reported by Group" },
  { accessorKey: "risk_type", header: "Risk Type" },
  { accessorKey: "overtime", header: "Overtime" },
]
