"use client"
import { reports } from "../app/data/ReportData";  
import { Pie, PieChart } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const reportCountryData = reports.reduce((acc: Record<string, number>, report) => {
  const country = report.site;
  if (!acc[country]) {
    acc[country] = 0;
  }
  acc[country]++;
  return acc;
}, {});

const chartData = Object.entries(reportCountryData).map(([country, count], index) => ({
  country,
  visitors: count,
  fill: `var(--chart-${(index % 5) + 1})`, // cycle through 5 colors
}));

const chartConfig: ChartConfig = chartData.reduce((config, item) => {
  config[item.country] = {
    label: item.country,
    color: item.fill,
  };
  return config;
}, {} as ChartConfig);

export function ChartPieSimple() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reports by Country</CardTitle>
        <CardDescription>Distribution of sites</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="country" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing reports per site
        </div>
      </CardFooter>
    </Card>
  )
}
