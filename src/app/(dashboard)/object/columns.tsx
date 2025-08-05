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
import { useState } from "react";
import Image from "next/image";

export interface Game {
  id: number;
  title: string;
  details: string;
  link: string;
  image: string;
  priority: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface GameTableData {
  id: string;
  title: string;
  details: string;
  category: string;
  priority: number;
}

export const objectColumns: ColumnDef<GameTableData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const game = row.original;
      return (
        <div className="flex gap-2">
          <ViewObjectDetails id={game.id} />
          <EditObjectModal id={game.id} />
          <DeleteObjectModal id={game.id} />
        </div>
      );
    },
  },
];

function ViewObjectDetails({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGame = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/objects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: ApiResponse<Game> = await response.json();
      if (data.success) setGame(data.data);
    } catch (error) {
      console.error("Error fetching game:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchGame();
  };

  return (
    <>
      <Button
        size="icon"
        onClick={openModal}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p>Loading...</p>
          ) : game ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative w-48 h-48">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/200";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {game.details}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {game.category?.name}
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span>{" "}
                      {game.priority}
                    </p>
                    <a
                      href={game.link}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      View Game Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No game data found</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditObjectModal({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    details: "",
    link: "",
    categoryId: "",
    priority: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      // Fetch game data
      const gameResponse = await fetch(
        `https://api.t-coin.code-studio4.com/api/objects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const gameData: ApiResponse<Game> = await gameResponse.json();

      if (gameData.success) {
        setForm({
          title: gameData.data.title,
          details: gameData.data.details,
          link: gameData.data.link,
          categoryId: String(gameData.data.category?.id || ""),
          priority: gameData.data.priority,
        });
      }

      // Fetch categories
      const categoriesResponse = await fetch(
        "https://api.t-coin.code-studio4.com/api/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const categoriesData: ApiResponse<Category[]> =
        await categoriesResponse.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/objects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const result: ApiResponse<Game> = await response.json();
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => {
          setIsOpen(true);
          fetchData();
        }}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Game Object</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <Input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
              />
              <Input
                name="details"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Details"
              />
              <Input
                name="link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="Link"
              />
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                name="priority"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: Number(e.target.value) })
                }
                placeholder="Priority"
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteObjectModal({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://api.t-coin.code-studio4.com/api/objects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result: ApiResponse<Game> = await response.json();
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting object:", error);
    }
    setLoading(false);
    setIsOpen(false);
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
            <DialogTitle>Delete Game Object</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this game? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
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
