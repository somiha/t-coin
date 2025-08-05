"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Eye } from "lucide-react";
import Image from "next/image";

interface ProfileData {
  full_name: string;
  email: string;
  phone_no: string;
  nid_card_number: string;
  pin_number: string;
  image: string;
  nid_card_front: string;
  nid_card_back: string;
  passport: string;
  nid_card_front_pic_url: string;
  nid_card_back_pic_url: string;
  passport_file_url: string;
  tcoin_balance: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminType, setAdminType] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    email: "",
    phone_no: "",
    nid_card_number: "",
    pin_number: "",
    image: "",
    nid_card_front: "",
    nid_card_back: "",
    passport: "",
    nid_card_front_pic_url: "",
    nid_card_back_pic_url: "",
    passport_file_url: "",
    tcoin_balance: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminType = localStorage.getItem("adminType");
        const user = localStorage.getItem("user");

        const userId = user ? JSON.parse(user).id : null;
        const users = user ? JSON.parse(user) : null;

        if (!userId) {
          router.push("/signin");
          return;
        }

        setAdminType(adminType === "super_admin" ? "Super Admin" : "Admin");

        setProfileData({
          full_name: users?.full_name || "",
          email: users?.email || "",
          phone_no: users?.phone_no || "",
          nid_card_number: users?.nid_card_number || "",
          pin_number: users?.pin_number || "",
          image: users?.image || "",
          nid_card_front: users?.nid_card_front_pic_url || "",
          nid_card_back: users?.nid_card_back_pic_url || "",
          passport: users?.passport_file_url || "",
          nid_card_front_pic_url: users?.nid_card_front_pic_url || "",
          nid_card_back_pic_url: users?.nid_card_back_pic_url || "",
          passport_file_url: users?.passport_file_url || "",
          tcoin_balance: users?.tcoin_balance || "",
        });
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const adminType = localStorage.getItem("adminType");
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user).id : null;

      const endpoint =
        adminType === "super_admin"
          ? `https://api.t-coin.code-studio4.com/api/super-admin/${userId}`
          : `https://api.t-coin.code-studio4.com/api/admins/${userId}`;

      const formData = new FormData();
      for (const [key, value] of Object.entries(profileData)) {
        if (value) formData.append(key, value);
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      const data = await response.json();

      if (data?.data) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(data.data));
        setProfileData({
          full_name: data.data.full_name,
          email: data.data.email,
          phone_no: data.data.phone_no,
          nid_card_number: data.data.nid_card_number,
          pin_number: data.data.pin_number,
          image: data.data.image,
          nid_card_front: data.data.nid_card_front_pic_url,
          nid_card_back: data.data.nid_card_back_pic_url,
          passport: data.data.passport_file_url,
          nid_card_front_pic_url: data.data.nid_card_front_pic_url,
          nid_card_back_pic_url: data.data.nid_card_back_pic_url,
          passport_file_url: data.data.passport_file_url,
          tcoin_balance: data.data.tcoin_balance,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and documents
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Profile Image Section */}
            <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-40 w-40 border-4 border-white dark:border-gray-800">
                  <AvatarImage
                    src={profileData.image || "/avatars/admin.png"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl font-medium bg-gray-200 dark:bg-gray-600">
                    {profileData.full_name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {profileData.full_name}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full inline-block">
                    {adminType}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="image" className="block mb-2 font-medium">
                    Profile Image
                  </Label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="w-full md:w-2/3 p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="font-medium">
                      Full Name
                    </Label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={profileData.full_name || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Email
                    </Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_no" className="font-medium">
                      Phone Number
                    </Label>
                    <input
                      id="phone_no"
                      name="phone_no"
                      type="tel"
                      value={profileData.phone_no || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nid_card_number" className="font-medium">
                      NID Card Number
                    </Label>
                    <input
                      id="nid_card_number"
                      name="nid_card_number"
                      type="text"
                      value={profileData.nid_card_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="pin_number" className="font-medium">
                      PIN Number
                    </Label>
                    <input
                      id="pin_number"
                      name="pin_number"
                      type="password"
                      value={profileData.pin_number || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="t-coin" className="font-medium">
                      TCoin Balance
                    </Label>
                    <input
                      id="t-coin"
                      name="t-coin"
                      type="number"
                      value={profileData.tcoin_balance || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Documents
                  </h3>

                  {/* NID Front Section */}
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Label htmlFor="nid_card_front" className="font-medium">
                      NID Front
                    </Label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {profileData.nid_card_front ? (
                        <div className="flex-1">
                          <div className="relative aspect-[4/3] w-full max-w-md border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <Image
                              src={profileData.nid_card_front || ""}
                              alt="NID Front"
                              className="w-full h-full object-contain"
                              width={150}
                              height={140}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                              <a
                                href={profileData.nid_card_front}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-blue-200"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-500 dark:text-gray-400">
                          No NID front uploaded
                        </div>
                      )}
                      <div className="w-full md:w-auto">
                        <input
                          id="nid_card_front"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(e, "nid_card_front")
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* NID Back Section */}
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Label htmlFor="nid_card_back" className="font-medium">
                      NID Back
                    </Label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {profileData.nid_card_back ? (
                        <div className="flex-1">
                          <div className="relative aspect-[4/3] w-full max-w-md border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <Image
                              src={profileData.nid_card_back || ""}
                              alt="NID Back"
                              className="w-full h-full object-contain"
                              width={150}
                              height={140}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                              <a
                                href={profileData.nid_card_back || ""}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-blue-200"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-500 dark:text-gray-400">
                          No NID back uploaded
                        </div>
                      )}
                      <div className="w-full md:w-auto">
                        <input
                          id="nid_card_back"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "nid_card_back")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passport Section */}
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Label htmlFor="passport" className="font-medium">
                      Passport
                    </Label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {profileData.passport ? (
                        <div className="flex-1">
                          <div className="relative aspect-[4/3] w-full max-w-md border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <Image
                              src={profileData.passport || ""}
                              alt="Passport"
                              width={150}
                              height={140}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                              <a
                                href={profileData.passport}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-blue-200"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-500 dark:text-gray-400">
                          No passport uploaded
                        </div>
                      )}
                      <div className="w-full md:w-auto">
                        <input
                          id="passport"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "passport")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-3"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
