"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TransactionFilterProps {
  filterRange: string;
  setFilterRange: (range: string) => void;
  customFrom: Date | null;
  setCustomFrom: (date: Date | null) => void;
  customTo: Date | null;
  setCustomTo: (date: Date | null) => void;
}

export function TransactionFilter({
  filterRange,
  setFilterRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}: TransactionFilterProps) {
  return (
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
          <Button variant="outline" onClick={() => setFilterRange("all")}>
            All Time
          </Button>
          <Button variant="outline" onClick={() => setFilterRange("last7")}>
            Last 7 Days
          </Button>
          <Button variant="outline" onClick={() => setFilterRange("last14")}>
            Last 14 Days
          </Button>
          <Button variant="outline" onClick={() => setFilterRange("last30")}>
            Last 1 Month
          </Button>
          <Button variant="outline" onClick={() => setFilterRange("last365")}>
            Last 1 Year
          </Button>

          <div className="border-t pt-2">
            <span className="text-sm text-muted-foreground">Custom Range</span>
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
  );
}
