import { ColumnDef } from "@tanstack/react-table"
import { ReportData } from "../data/ReportData"

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
        header: "Date",
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