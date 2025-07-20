import { TransactionsTable } from "../_components/transaction-table";

export default function CashOutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Send Money Transactions
              </h1>
            </div>
            <TransactionsTable type="Cash Out" />
          </div>
        </main>
      </div>
    </div>
  );
}
