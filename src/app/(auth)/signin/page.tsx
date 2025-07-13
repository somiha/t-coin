"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone_no: "",
    pin_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const changeChecked = (checked: boolean) => {
    setIsSuperAdmin(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isSuperAdmin
        ? "http://api.t-coin.code-studio4.com/api/super-admin/signin"
        : "http://api.t-coin.code-studio4.com/api/admins/signin";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_no: formData.phone_no,
          pin_number: formData.pin_number,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data.token) {
          localStorage.setItem("authToken", data.data.token);
        }

        if (data?.data?.user) {
          console.log("5Storing user:", data.data.user);
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));

          localStorage.setItem(
            "adminType",
            isSuperAdmin ? "super-admin" : "admin"
          );

          if (data.data.user.type) {
            localStorage.setItem("adminType", data.data.user.type);
          }
        }

        router.push("/");
      } else {
        setErrorMessage(
          data.message || "Sign in failed. Please check your credentials."
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage("An error occurred during sign in. Please try again.");
      setErrorModalOpen(true);
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm">
          Checking authentication...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] p-4">
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Sign In Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{errorMessage}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setErrorModalOpen(false)}
              className="bg-[#71113D] hover:bg-[#5a0f2f]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-md bg-[#f9fafb] shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#3F1729] via-[#71113D] to-[#D4136B] text-transparent bg-clip-text text-center">
            Welcome to TCoin Admin Panel!
          </h1>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Sign in to continue
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="phone_no" className="text-sm text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone_no"
                type="text"
                placeholder="+880178663692"
                value={formData.phone_no}
                onChange={handleInputChange}
                className="mt-1 bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="pin_number" className="text-sm text-gray-700">
                PIN Number
              </Label>
              <Input
                id="pin_number"
                type="password"
                placeholder="••••••"
                value={formData.pin_number}
                onChange={handleInputChange}
                className="mt-1 bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <Button
                variant="link"
                className="p-0 text-[#6366F1] hover:underline"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot PIN?
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="superAdminCheckbox"
                checked={isSuperAdmin}
                onCheckedChange={changeChecked}
              />
              <Label htmlFor="superAdminCheckbox">Sign In as Super Admin</Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3F1729] via-[#71113D] to-[#D4136B] text-white hover:opacity-90"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Do not have an account?{" "}
              <a href="/signup" className="text-[#6366F1] hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
