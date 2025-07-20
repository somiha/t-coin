// app/(dashboard)/agents/page.tsx
"use client";

import { columns } from "./columns";
import { DataTable } from "../data-table";
import type { Agent } from "./columns";
import { useEffect, useState } from "react";

interface ApiAgent {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  isApproved: boolean;
  type: "agent";
  image?: string | null;
  canReceiveRemittanceList?: boolean;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (!userStr || !token) {
        console.error("Missing credentials");
        setLoading(false);
        return;
      }

      try {
        const currentUser = JSON.parse(userStr);
        const response = await fetch(
          `https://api.t-coin.code-studio4.com/api/admins/${currentUser.id}/agents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success && data.data) {
          const formattedAgents = data.data.map(
            (agent: ApiAgent): Agent => ({
              id: agent.id.toString(),
              name: agent.full_name,
              email: agent.email,
              phone: agent.phone_no,
              type: agent.type,
              isApproved: agent.isApproved,
              canReceiveRemittance: agent.canReceiveRemittanceList || false,
            })
          );
          setAgents(formattedAgents);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">My Agents</h1>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading agents...</p>
              </div>
            ) : (
              <DataTable columns={columns} data={agents} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
