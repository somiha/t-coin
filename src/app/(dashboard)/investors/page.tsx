import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { Investor } from "./columns";

const investors: Investor[] = [
  {
    id: "1",
    name: "Rashidatul Kobra",
    email: "kobrarashi@gmail.com",
    phone: "+1 123 456 7890",
    country: "Canada",
    address: "Los Angeles, CA 90001",
    avatar: "/avatars/1.png",
  },
  {
    id: "2",
    name: "Soykot Hosen",
    email: "kobrarashi@gmail.com",
    phone: "+1 123 456 7890",
    country: "Canada",
    address: "Los Angeles, CA 90001",
    avatar: "/avatars/2.png",
  },
];

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                All Investors
              </h1>
            </div>
            <DataTable columns={columns} data={investors} />
          </div>
        </main>
      </div>
    </div>
  );
}
