"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";

export type Banner = {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  active: boolean;
};

export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: "id",
    header: "Banner ID",
    size: 100,
  },
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-20 h-20 relative overflow-hidden rounded-md">
        <Image
          src={row.original.image}
          alt={row.original.title}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const banner = row.original;
      return (
        <div className="flex space-x-2">
          <EditBannerModal banner={banner} />
          <DeleteBannerModal banner={banner} />
        </div>
      );
    },
  },
];

function EditBannerModal({ banner }: { banner: Banner }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: banner.title,
    description: banner.description,
    link: banner.link,
    active: banner.active,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(banner.image);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const patchData = new FormData();
    patchData.append("title", formData.title);
    patchData.append("description", formData.description);
    patchData.append("link", formData.link);
    patchData.append("active", String(formData.active));
    if (selectedFile) patchData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/banners/${banner.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: patchData,
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error("Non-JSON response: " + text.slice(0, 100));
      }

      const result = await response.json();
      if (result.success) window.location.reload();
    } catch (error) {
      console.error("Error updating banner", error);
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
        <Pencil className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <Input
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Link"
            />

            <div className="space-y-1">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400"
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="w-full h-40 relative rounded-md overflow-hidden mt-2">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to select an image
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteBannerModal({ banner }: { banner: Banner }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://api.t-coin.code-studio4.com/api/banners/${banner.id}`,
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
      console.error("Error deleting banner", error);
    }

    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="icon"
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white"
      >
        <Trash className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner?
            </DialogDescription>
          </DialogHeader>

          <div className="w-full h-40 relative rounded-md overflow-hidden border mt-2">
            <Image
              src={banner.image}
              alt={`Banner ${banner.id}`}
              fill
              className="object-cover"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white ml-2"
            >
              Delete Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
