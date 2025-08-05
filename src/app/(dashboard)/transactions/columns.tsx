// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Eye } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import Image from "next/image";
// import { format } from "date-fns";

// export type Transaction = {
//   id: number;
//   name: string;
//   image: string;
//   method: string;
//   type: string;
//   amount: string;
//   charge: number;
//   date: string;
//   transaction_status?: string;
//   description?: string;
//   receiver_nid?: string;
//   sender_nid?: string;
//   method_label?: string;
//   bank_name?: string;
//   bank_branch_name?: string;
//   account_holder_name?: string;
//   account_number?: string;
//   account_holder_mobile_number?: string;
//   sender_name?: string;
//   receiver_name?: string;
//   sender_image_url?: string;
//   receiver_image_url?: string;
//   transaction_type?: string;
//   local_currency_amount?: string;
// };

// export const columns: ColumnDef<Transaction>[] = [
//   {
//     accessorKey: "id",
//     header: "Transaction Id",
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => (
//       <div className="flex items-center">
//         <div className="w-6 h-6 relative rounded-full overflow-hidden mr-4">
//           <Image
//             src={row.original.image}
//             alt={row.original.name}
//             fill
//             className="object-cover"
//           />
//         </div>
//         <span className="text-sm">{row.original.name}</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "method",
//     header: "Method",
//   },
//   {
//     accessorKey: "type",
//     header: "Transaction Type",
//   },
//   {
//     accessorKey: "amount",
//     header: "Amount",
//   },
//   {
//     accessorKey: "charge",
//     header: "Charge",
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ row }) => {
//       const raw = row.original.date;
//       try {
//         return format(new Date(raw), "yyyy-MM-dd HH:mm");
//       } catch {
//         return "Invalid Date";
//       }
//     },
//   },
//   {
//     id: "action",
//     header: "Action",
//     cell: ({ row }) => {
//       const transaction = row.original;
//       return (
//         <div className="flex space-x-2">
//           <ViewTransactionModal transaction={transaction} />
//         </div>
//       );
//     },
//   },
// ];

// function ViewTransactionModal({ transaction }: { transaction: Transaction }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <Button
//         size="icon"
//         className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
//         onClick={() => setIsOpen(true)}
//       >
//         <Eye className="w-4 h-4" />
//       </Button>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="fixed max-h-[90vh] w-[800px] max-w-[90vw] overflow-y-auto">
//           <DialogHeader className="sticky top-0 bg-white z-10 pt-2 pb-4">
//             <DialogTitle className="text-md text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))]">
//               Transaction Details
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-6 pb-4">
//             {/* Transaction Overview */}
//             <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <h3 className="font-medium text-gray-500">Transaction ID</h3>
//                 <p className="mt-1">{transaction.id}</p>
//               </div>
//               <div>
//                 <h3 className="font-medium text-gray-500">Status</h3>
//                 <p className="mt-1 capitalize">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs ${
//                       transaction.transaction_status === "Pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : transaction.transaction_status === "Completed"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {transaction.transaction_status}
//                   </span>
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-medium text-gray-500">Date</h3>
//                 <p className="mt-1">
//                   {transaction.date &&
//                   !isNaN(new Date(transaction.date).getTime())
//                     ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
//                     : "Invalid Date"}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-medium text-gray-500">Transaction Type</h3>
//                 <p className="mt-1">
//                   {transaction.transaction_type || transaction.type}
//                 </p>
//               </div>
//             </div>

//             {/* Parties Involved */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-4 border rounded-lg">
//                 <h3 className="font-medium text-lg mb-3">Sender Information</h3>
//                 <div className="flex items-start space-x-4">
//                   {transaction.sender_image_url && (
//                     <div className="w-12 h-12 relative rounded-full overflow-hidden">
//                       <Image
//                         src={transaction.sender_image_url}
//                         alt={transaction.sender_name || "Sender"}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-medium">
//                       {transaction.sender_name || "N/A"}
//                     </p>
//                     {transaction.sender_nid && (
//                       <p className="text-sm text-gray-500">
//                         NID: {transaction.sender_nid}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 border rounded-lg">
//                 <h3 className="font-medium text-lg mb-3">
//                   Receiver Information
//                 </h3>
//                 <div className="flex items-start space-x-4">
//                   {transaction.receiver_image_url && (
//                     <div className="w-12 h-12 relative rounded-full overflow-hidden">
//                       <Image
//                         src={transaction.receiver_image_url}
//                         alt={transaction.receiver_name || "Receiver"}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-medium">
//                       {transaction.receiver_name || "N/A"}
//                     </p>
//                     {transaction.receiver_nid && (
//                       <p className="text-sm text-gray-500">
//                         NID: {transaction.receiver_nid}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Transaction Details */}
//             <div className="p-4 border rounded-lg">
//               <h3 className="font-medium text-lg mb-3">Transaction Details</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-medium text-gray-500">Amount</h3>
//                   <p className="mt-1">{transaction.amount} T-Coin</p>
//                 </div>
//                 {transaction.local_currency_amount && (
//                   <div>
//                     <h3 className="font-medium text-gray-500">Local Amount</h3>
//                     <p className="mt-1">৳{transaction.local_currency_amount}</p>
//                   </div>
//                 )}
//                 {transaction.charge && (
//                   <div>
//                     <h3 className="font-medium text-gray-500">Charge</h3>
//                     <p className="mt-1">{transaction.charge}</p>
//                   </div>
//                 )}
//                 {transaction.method_label && (
//                   <div>
//                     <h3 className="font-medium text-gray-500">Method</h3>
//                     <p className="mt-1">{transaction.method_label}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Bank Details (if available) */}
//             {(transaction.bank_name || transaction.account_number) && (
//               <div className="p-4 border rounded-lg">
//                 <h3 className="font-medium text-lg mb-3">Bank Details</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   {transaction.bank_name && (
//                     <div>
//                       <h3 className="font-medium text-gray-500">Bank Name</h3>
//                       <p className="mt-1">{transaction.bank_name}</p>
//                     </div>
//                   )}
//                   {transaction.bank_branch_name && (
//                     <div>
//                       <h3 className="font-medium text-gray-500">Branch Name</h3>
//                       <p className="mt-1">{transaction.bank_branch_name}</p>
//                     </div>
//                   )}
//                   {transaction.account_holder_name && (
//                     <div>
//                       <h3 className="font-medium text-gray-500">
//                         Account Holder
//                       </h3>
//                       <p className="mt-1">{transaction.account_holder_name}</p>
//                     </div>
//                   )}
//                   {transaction.account_number && (
//                     <div>
//                       <h3 className="font-medium text-gray-500">
//                         Account Number
//                       </h3>
//                       <p className="mt-1">{transaction.account_number}</p>
//                     </div>
//                   )}
//                   {transaction.account_holder_mobile_number && (
//                     <div>
//                       <h3 className="font-medium text-gray-500">
//                         Mobile Number
//                       </h3>
//                       <p className="mt-1">
//                         {transaction.account_holder_mobile_number}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Description */}
//             {transaction.description && (
//               <div className="p-4 border rounded-lg">
//                 <h3 className="font-medium text-lg mb-3">Description</h3>
//                 <p className="text-gray-700 whitespace-pre-line">
//                   {transaction.description}
//                 </p>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";

export type Transaction = {
  id: number;
  name: string;
  image: string;
  method: string;
  type: string;
  amount: string;
  charge: number;
  date: string;
  transaction_status?: string;
  description?: string;
  receiver_nid?: string;
  sender_nid?: string;
  method_label?: string;
  bank_name?: string;
  bank_branch_name?: string;
  account_holder_name?: string;
  account_number?: string;
  account_holder_mobile_number?: string;
  sender_name?: string;
  receiver_name?: string;
  sender_image_url?: string;
  receiver_image_url?: string;
  transaction_type?: string;
  local_currency_amount?: string;
  user?: {
    id: number;
  };
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction Id",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <div className="w-6 h-6 relative rounded-full overflow-hidden mr-4">
          <Image
            src={row.original.image}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "transaction_type",
    header: "Transaction Type",
  },
  {
    accessorKey: "type",
    header: "User Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "charge",
    header: "Charge",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const raw = row.original.date;
      try {
        return format(new Date(raw), "yyyy-MM-dd HH:mm");
      } catch {
        return "Invalid Date";
      }
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex space-x-2">
          <ViewTransactionModal transaction={transaction} />
          {transaction.transaction_type === "T-coin Deduction Requested" &&
            transaction.transaction_status === "Pending" && (
              <ApproveTransactionButton transaction={transaction} />
            )}
        </div>
      );
    },
  },
];

function ApproveTransactionButton({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approverNote, setApproverNote] = useState("Deduction validated");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (selectedAction: "APPROVE" | "REJECT") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Missing authToken");
      }

      // Determine approverEntityType based on transaction type

      // Create form data for file upload
      console.log("Transaction ID:", transaction.id);
      console.log("Approver Entity Type:", transaction.type);
      const formData = new FormData();
      formData.append("transactionId", transaction.id.toString());
      formData.append(
        "approverEntityId",
        (transaction.user?.id || 1).toString()
      );
      formData.append("approverEntityType", transaction.type);
      formData.append("action", selectedAction);
      formData.append("approverNote", approverNote);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        "https://api.t-coin.code-studio4.com/tcoin/operation/approve",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Transaction ${selectedAction.toLowerCase()}d successfully`
        );
        setIsModalOpen(false);
        window.location.reload();
      } else {
        throw new Error(
          data.message ||
            `Failed to ${selectedAction.toLowerCase()} transaction`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
      >
        <Pencil className="w-4 h-4" />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="fixed max-h-[90vh] w-[500px] max-w-[90vw] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pt-2 pb-4">
            <DialogTitle className="text-md text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))]">
              Transaction Review
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              {transaction.image && (
                <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0 border">
                  <Image
                    src={transaction.image}
                    alt="Transaction"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h3 className="font-medium">Transaction #{transaction.id}</h3>
                <p className="text-sm">
                  <span className="font-medium">Amount:</span>{" "}
                  {transaction.amount} T-Coin
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{" "}
                  {transaction.transaction_type || transaction.type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      transaction.transaction_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.transaction_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.transaction_status}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <label
                htmlFor="approverNote"
                className="block text-sm font-medium mb-2"
              >
                Review Note
              </label>
              <textarea
                id="approverNote"
                className="w-full p-3 border rounded-md min-h-[100px] text-sm"
                value={approverNote}
                onChange={(e) => setApproverNote(e.target.value)}
                placeholder="Enter your review note..."
              />
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Upload Approval Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      {imageFile ? imageFile.name : "Click to upload image"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {previewImage && (
                  <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleSubmit("REJECT")}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Processing..." : "Reject"}
              </Button>
              <Button
                onClick={() => handleSubmit("APPROVE")}
                disabled={isLoading}
                className="bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] text-white hover:opacity-90"
              >
                {isLoading ? "Processing..." : "Approve"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Keep the existing ViewTransactionModal component as is
function ViewTransactionModal({ transaction }: { transaction: Transaction }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="text-white bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:opacity-90"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed max-h-[90vh] w-[800px] max-w-[90vw] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pt-2 pb-4">
            <DialogTitle className="text-md text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))]">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pb-4">
            {/* Transaction Overview */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-500">Transaction ID</h3>
                <p className="mt-1">{transaction.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Status</h3>
                <p className="mt-1 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.transaction_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.transaction_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.transaction_status}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Date</h3>
                <p className="mt-1">
                  {transaction.date &&
                  !isNaN(new Date(transaction.date).getTime())
                    ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
                    : "Invalid Date"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Transaction Type</h3>
                <p className="mt-1">
                  {transaction.transaction_type || transaction.type}
                </p>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Sender Information</h3>
                <div className="flex items-start space-x-4">
                  {transaction.sender_image_url && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={transaction.sender_image_url}
                        alt={transaction.sender_name || "Sender"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.sender_name || "N/A"}
                    </p>
                    {transaction.sender_nid && (
                      <p className="text-sm text-gray-500">
                        NID: {transaction.sender_nid}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">
                  Receiver Information
                </h3>
                <div className="flex items-start space-x-4">
                  {transaction.receiver_image_url && (
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={transaction.receiver_image_url}
                        alt={transaction.receiver_name || "Receiver"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.receiver_name || "N/A"}
                    </p>
                    {transaction.receiver_nid && (
                      <p className="text-sm text-gray-500">
                        NID: {transaction.receiver_nid}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-lg mb-3">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Amount</h3>
                  <p className="mt-1">{transaction.amount} T-Coin</p>
                </div>
                {transaction.local_currency_amount && (
                  <div>
                    <h3 className="font-medium text-gray-500">Local Amount</h3>
                    <p className="mt-1">৳{transaction.local_currency_amount}</p>
                  </div>
                )}
                {transaction.charge && (
                  <div>
                    <h3 className="font-medium text-gray-500">Charge</h3>
                    <p className="mt-1">{transaction.charge}</p>
                  </div>
                )}
                {transaction.method_label && (
                  <div>
                    <h3 className="font-medium text-gray-500">Method</h3>
                    <p className="mt-1">{transaction.method_label}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details (if available) */}
            {(transaction.bank_name || transaction.account_number) && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {transaction.bank_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">Bank Name</h3>
                      <p className="mt-1">{transaction.bank_name}</p>
                    </div>
                  )}
                  {transaction.bank_branch_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">Branch Name</h3>
                      <p className="mt-1">{transaction.bank_branch_name}</p>
                    </div>
                  )}
                  {transaction.account_holder_name && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Account Holder
                      </h3>
                      <p className="mt-1">{transaction.account_holder_name}</p>
                    </div>
                  )}
                  {transaction.account_number && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Account Number
                      </h3>
                      <p className="mt-1">{transaction.account_number}</p>
                    </div>
                  )}
                  {transaction.account_holder_mobile_number && (
                    <div>
                      <h3 className="font-medium text-gray-500">
                        Mobile Number
                      </h3>
                      <p className="mt-1">
                        {transaction.account_holder_mobile_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {transaction.description && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {transaction.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
