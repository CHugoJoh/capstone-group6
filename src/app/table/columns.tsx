"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReportData } from "../data/ReportData"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<ReportData>[] = [
    {accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {   
        accessorKey: "description",
        header: "Description",
    },
    {
    accessorKey: "date",
    header: ({ column }) => {
    return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        )
    },
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "site",
        header: "Site"
    },
    {
        accessorKey: "tags",
        header: "Tags"
    }
    
  
]