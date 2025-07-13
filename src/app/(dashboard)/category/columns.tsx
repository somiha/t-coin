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

export type Category = {
  id: string;
  name: string;
  gameCount: number;
};

interface Game {
  id: number;
  title: string;
  details: string;
  link: string;
  image: string;
  priority: number;
}

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "Category ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gameCount",
    header: "Games Count",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2">
          <ViewCategoryDetails category={category} />
          <EditCategoryModal category={category} />
          <DeleteCategoryModal category={category} />
        </div>
      );
    },
  },
];

function ViewCategoryDetails({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/categories/${category.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setGames(data.data.games || []);
      }
    } catch (error) {
      console.error("Error fetching games", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchGames();
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Games in {category.name}</DialogTitle>
            <DialogDescription>
              List of all games in this category ({games.length})
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading games...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.length === 0 ? (
                <p className="text-center py-4">
                  No games found in this category
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={game.image}
                          alt={game.title}
                          width={96} // matches w-24 (24 * 4 = 96)
                          height={96} // matches h-24
                          className="object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/100";
                          }}
                          unoptimized={true} // If you're using external URLs that Next.js can't optimize
                        />
                        <div className="flex-1">
                          <h3 className="font-bold">{game.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {game.details}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm bg-secondary px-2 py-1 rounded">
                              Priority: {game.priority}
                            </span>
                            <a
                              href={game.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Game
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditCategoryModal({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) window.location.reload();
    } catch (error) {
      console.error("Error updating category", error);
    }

    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
              >
                Save
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteCategoryModal({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/categories/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) window.location.reload();
    } catch (error) {
      console.error("Error deleting category", error);
    }

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
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {category.name}? This will also
              remove all associated games.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
