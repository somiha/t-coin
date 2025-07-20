"use client";

import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { Participant } from "./columns";
import { useEffect, useState } from "react";

export default function ParticipantPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const campaignId = "1"; // replace with dynamic ID if needed
    fetch(
      `https://api.t-coin.code-studio4.com/api/campaign/${campaignId}/results`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setParticipants(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch campaign results:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Participants
              </h1>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable columns={columns} data={participants} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
