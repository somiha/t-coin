"use client";

import { useEffect, useState } from "react";
import { columns, Remittance } from "./columns";
import { DataTable } from "../data-table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays, isWithinInterval } from "date-fns";

// API response type
interface RemittanceApiResponse {
  id: number;
  transaction_type: string;
  amount: string;
  local_currency_amount: string;
  transaction_date: string;
  transaction_status: string;
  agent_id: number | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  receiver_nid: string;
  sender_nid: string | null;
  method_type: string | null;
  method_label: string;
  receiver_number: string | null;
  bank_name: string | null;
  bank_branch_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  account_holder_mobile_number: string | null;
  sender_image_url: string | null;
  receiver_image_url: string | null;
  sender_name: string | null;
  receiver_name: string | null;
  user: {
    id: number;
  };
}

export default function RemittancePage() {
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [filterRange, setFilterRange] = useState("all");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);

  const today = new Date();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Missing authToken");
      return;
    }

    fetch(
      "https://api.t-coin.code-studio4.com/api/transaction-history/remittance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map(
            (item: RemittanceApiResponse): Remittance => {
              const dateObj = new Date(item.transaction_date);
              return {
                id: String(item.id),
                country:
                  item.description?.match(/To NID (\d+)/)?.[1] || "Unknown",
                method: item.method_type || "N/A",
                amount: parseFloat(item.amount),
                date: dateObj.toISOString(),
              };
            }
          );
          setRemittances(formatted);
        } else {
          console.error("Invalid API response", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredRemittance =
    filterRange === "all"
      ? remittances
      : remittances.filter((item) => {
          const itemDate = new Date(item.date);
          switch (filterRange) {
            case "last7":
              return isWithinInterval(itemDate, {
                start: subDays(today, 7),
                end: today,
              });
            case "last14":
              return isWithinInterval(itemDate, {
                start: subDays(today, 14),
                end: today,
              });
            case "last30":
              return isWithinInterval(itemDate, {
                start: subDays(today, 30),
                end: today,
              });
            case "last365":
              return isWithinInterval(itemDate, {
                start: subDays(today, 365),
                end: today,
              });
            case "custom":
              if (customFrom && customTo) {
                return isWithinInterval(itemDate, {
                  start: customFrom,
                  end: customTo,
                });
              }
              return true;
            default:
              return true;
          }
        });

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                All Remittances
              </h1>

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90">
                    {
                      {
                        all: "All",
                        last7: "Last 7 Days",
                        last14: "Last 14 Days",
                        last30: "Last 1 Month",
                        last365: "Last 1 Year",
                        custom:
                          customFrom && customTo
                            ? `${customFrom.toLocaleDateString()} - ${customTo.toLocaleDateString()}`
                            : "Custom Range",
                      }[filterRange]
                    }
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[280px] space-y-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setFilterRange("all")}
                    >
                      All Time
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterRange("last7")}
                    >
                      Last 7 Days
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterRange("last14")}
                    >
                      Last 14 Days
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterRange("last30")}
                    >
                      Last 1 Month
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilterRange("last365")}
                    >
                      Last 1 Year
                    </Button>

                    <div className="border-t pt-2">
                      <span className="text-sm text-muted-foreground">
                        Custom Range
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <DatePicker
                          selected={customFrom}
                          onChange={(date) => setCustomFrom(date)}
                          selectsStart
                          startDate={customFrom}
                          endDate={customTo}
                          placeholderText="From"
                          className="w-full border rounded px-2 py-1"
                        />
                        <DatePicker
                          selected={customTo}
                          onChange={(date) => setCustomTo(date)}
                          selectsEnd
                          startDate={customFrom}
                          endDate={customTo}
                          placeholderText="To"
                          className="w-full border rounded px-2 py-1"
                        />
                        <Button
                          onClick={() => setFilterRange("custom")}
                          disabled={!customFrom || !customTo}
                          className="w-full bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <DataTable columns={columns} data={filteredRemittance} />
          </div>
        </main>
      </div>
    </div>
  );
}
