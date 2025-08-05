"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";

// types/bank.ts
export interface Bank {
  id: number;
  name: string;
  type: "mobile" | "bank";
  country: string;
  supported_methods: string[];
  active: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTableData {
  id: string;
  name: string;
  type: string;
  country: string;
  methods: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const bankColumns: ColumnDef<BankTableData>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "methods", header: "Supported Methods" },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (row.original.active ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bank = row.original;
      return (
        <div className="flex gap-2">
          <ViewBankDetails id={bank.id} />
          <EditBankModal id={bank.id} />
          <DeleteBankModal id={bank.id} />
        </div>
      );
    },
  },
];

function ViewBankDetails({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBank = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/bank",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (data.success && data.data?.banks) {
        const foundBank = data.data.banks.find(
          (b: Bank) => String(b.id) === id
        );
        setBank(foundBank || null);
      }
    } catch (error) {
      console.error("Error fetching bank:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => {
          setIsOpen(true);
          fetchBank();
        }}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p>Loading...</p>
          ) : bank ? (
            <div className="space-y-4">
              {bank.image && (
                <div className="flex justify-center">
                  <Image
                    src={bank.image}
                    alt={bank.name}
                    width={150}
                    height={100}
                    className="rounded"
                    unoptimized
                  />
                </div>
              )}
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {bank.name}
                </p>
                <p>
                  <strong>Type:</strong> {bank.type}
                </p>
                <p>
                  <strong>Country:</strong> {bank.country}
                </p>
                <p>
                  <strong>Methods:</strong> {bank.supported_methods.join(", ")}
                </p>
                <p>
                  <strong>Status:</strong> {bank.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ) : (
            <p>No bank data found</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditBankModal({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "mobile",
    country: "",
    supported_methods: [] as string[],
    active: true,
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const fetchBank = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.t-coin.code-studio4.com/api/bank",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (data.success && data.data?.banks) {
        const foundBank = data.data.banks.find(
          (b: Bank) => String(b.id) === id
        );
        if (foundBank) {
          setForm({
            name: foundBank.name,
            type: foundBank.type,
            country: foundBank.country,
            supported_methods: foundBank.supported_methods,
            active: foundBank.active,
            image: null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.country || form.supported_methods.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("country", form.country);
      form.supported_methods.forEach((method) => {
        formData.append("supported_methods[]", method);
      });
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/bank/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Bank updated successfully!");
        window.location.reload();
      } else {
        alert(result.message || "Failed to update bank");
      }
    } catch (error) {
      console.error("Error updating bank:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => {
          setIsOpen(true);
          fetchBank();
        }}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bank</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bank Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "mobile" | "bank",
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="mobile">Mobile</option>
                  <option value="bank">Bank</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="Country"
                />
              </div>

              <div className="space-y-2">
                <Label>Supported Methods *</Label>
                <div className="flex flex-col gap-2">
                  {["cash in", "cash out"].map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.supported_methods.includes(method)}
                        onChange={(e) => {
                          const methods = [...form.supported_methods];
                          if (e.target.checked) {
                            methods.push(method);
                          } else {
                            const index = methods.indexOf(method);
                            if (index > -1) methods.splice(index, 1);
                          }
                          setForm({ ...form, supported_methods: methods });
                        }}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Bank Logo</Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setForm({ ...form, image: e.target.files[0] });
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={form.active}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, active: checked })
                  }
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteBankModal({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/bank/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Bank deleted successfully!");
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete bank");
      }
    } catch (error) {
      console.error("Error deleting bank:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Trash className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bank</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bank? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
