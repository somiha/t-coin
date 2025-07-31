"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            {/* Dashboard Header */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            </div>

            {/* Data Cards Grid */}
            <div className="grid md:gap-x-4 lg:gap-x-12 gap-y-4 max-[1219px]:grid-cols-2 min-[1220px]:grid-cols-3">
              <Card className="min-w-72 h-40 py-4 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total
                    <br />
                    Users
                  </CardTitle>

                  <Image
                    src="/person-fill.png"
                    alt="person-fill"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,45,750</div>
                </CardContent>
              </Card>

              <Card className="min-w-72 h-40 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total
                    <br />
                    Agents
                  </CardTitle>
                  <Image
                    src="/people-fill.png"
                    alt="people-fill"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">55,450</div>
                </CardContent>
              </Card>

              <Card className="min-w-72 h-40 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total <br />
                    Investors
                  </CardTitle>
                  <Image
                    src="/person-lines-fill.png"
                    alt="person-lines-fill"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,750</div>
                </CardContent>
              </Card>

              <Card className="min-w-72 h-40 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium ">
                    Total <br />
                    Country
                  </CardTitle>
                  <Image
                    src="/coronavirus.png"
                    alt="globe"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">110</div>
                </CardContent>
              </Card>

              <Card className="min-w-72 h-40 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Total
                    <br />
                    TCoins
                  </CardTitle>
                  <Image src="/t-coin.png" alt="tcoin" width={30} height={30} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10,55,450</div>
                </CardContent>
              </Card>
              <Card className="min-w-72 h-40 gap-4 border-[#FFDEDE]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Today’s
                    <br />
                    Total Withdraw
                  </CardTitle>
                  <Image
                    src="/withdraw.png"
                    alt="withdraw"
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,750</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
