"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RemittanceDetails() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Remittance Details</h2>

      <Card className="w-full">
        <CardContent className="p-6 space-y-6 lg:pl-16 md:pl-1">
          {/* Image */}

          <div className="w-full max-w-[600px]">
            <Label htmlFor="country" className="block mb-4 text-md font-medium">
              Country
            </Label>
            <Input id="country" value="Bangladesh" readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label htmlFor="method" className="block mb-4 text-md font-medium">
              Method
            </Label>
            <Input id="method" value="Bkash" readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label htmlFor="mobile" className="block mb-4 text-md font-medium">
              Mobile Number
            </Label>
            <Input id="mobile" value="+1 123 456 7890" readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label htmlFor="amount" className="block mb-4 text-md font-medium">
              Amount
            </Label>
            <Input id="amount" value="25580" readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label htmlFor="charge" className="block mb-4 text-md font-medium">
              Charge
            </Label>
            <Input id="charge" value="10 Tcoin" readOnly />
          </div>

          <div className="w-full max-w-[600px]">
            <Label htmlFor="nid" className="block mb-4 text-md font-medium">
              NID Card Number
            </Label>
            <Input id="nid" value="2145326753" readOnly />
          </div>
          <Card className="mt-6 w-full max-w-xl">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-md h-48 flex flex-col items-center justify-center border border-[#FFDCEC]">
                  <p className="text-sm mb-2">Front Side of NID Card</p>
                  <Image
                    src="/nid-front-placeholder.png"
                    alt="Front NID"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>

                <div className="bg-white rounded-md h-48 flex flex-col items-center justify-center border border-[#FFDCEC]">
                  <p className="text-sm mb-2">Back Side of NID Card</p>
                  <Image
                    src="/nid-back-placeholder.png"
                    alt="Back NID"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
