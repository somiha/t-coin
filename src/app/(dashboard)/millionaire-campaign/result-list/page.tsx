import { columns } from "./columns";
import { DataTable } from "../../data-table";
import type { Result } from "./columns";

const result: Result[] = [
  {
    id: "1",
    name: "Somiha",
    participate_date: "2023-01-01",
    ticket_number: "123",
    date: "2023-01-01",
    duration: "2 hours",
  },
  {
    id: "2",
    name: "Somiha",
    participate_date: "2023-01-01",
    ticket_number: "123",
    date: "2023-01-01",
    duration: "2 hours",
  },
];

export default function Result() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Results</h1>
            </div>
            <DataTable columns={columns} data={result} />
          </div>
        </main>
      </div>
    </div>
  );
}
