"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { Savings } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays, isWithinInterval } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const allSavings: Savings[] = [
  {
    id: "1",
    name: "John Doe",
    type: "Savings",
    amount: 1000,
    mobile_number: "1234567890",
    country: "Bangladesh",
    address: "Dhaka, Bangladesh",
    date: "2025-01-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "Savings",
    amount: 2000,
    mobile_number: "9876543210",
    country: "India",
    address: "New Delhi, India",
    date: "2025-02-01",
  },
  {
    id: "3",
    name: "Alice Johnson",
    type: "Savings",
    amount: 1500,
    mobile_number: "5555555555",
    country: "United States",
    address: "Los Angeles, California",
    date: "2025-03-01",
  },
];

export default function Savings() {
  const [filterRange, setFilterRange] = useState("all");
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);

  const today = new Date();

  const filteredSavings =
    filterRange === "all"
      ? allSavings
      : allSavings.filter((item) => {
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
              <h1 className="text-2xl font-bold tracking-tight">Savings</h1>

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

            <div className="grid md:gap-x-4 lg:gap-x-12 gap-y-4 max-[1219px]:grid-cols-2 min-[1220px]:grid-cols-3">
              <Card className="min-w-72 h-40 py-4 gap-4 border-[#FFDEDE] rounded-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total Savings
                    <br />
                    Amount
                  </CardTitle>

                  <Image
                    src="/money-sack.png"
                    alt="money-sack"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,45,750</div>
                </CardContent>
              </Card>
              <Card className="min-w-72 h-40 py-4 gap-4 border-[#FFDEDE] rounded-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total Savings
                    <br />
                    Account
                  </CardTitle>

                  <Image
                    src="/people-fill.png"
                    alt="people-fill"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">430</div>
                </CardContent>
              </Card>
            </div>
            <DataTable columns={columns} data={filteredSavings} />
          </div>
        </main>
      </div>
    </div>
  );
}
