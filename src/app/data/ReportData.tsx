export type ReportData = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  status: 'open' | 'closed';
  site: string;
  tags: string[];
};

export const reports: ReportData[] = [{
    id: "1",
    title: "test report",
    description: "this is a test report",
    date: "2023-10-01",
    status: 'open',
    category: "workplace",
    site: "Krakow",
    tags: ["test", "sample"]
}, {
    id: "2",
    title: "second report",
    description: "this is the second test report",
    date: "2023-10-02",
    status: 'closed',
    category: "product",
    site: "Stockholm",
    tags: ["example", "demo"]
}]