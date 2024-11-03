"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSignIcon,
  LightbulbIcon,
  ShoppingCartIcon,
  Loader2,
} from "lucide-react";
import { api } from "@/trpc/react";
import type { TransactionStream as PlaidTransactionStream } from "plaid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionStream extends PlaidTransactionStream {
  predicted_next_date: string;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getCategoryIcon = (category: string[]) => {
  switch (category[0]) {
    case "Service":
      return <LightbulbIcon className="h-6 w-6 text-yellow-500" />;
    case "Shops":
      return <ShoppingCartIcon className="h-6 w-6 text-blue-500" />;
    default:
      return <DollarSignIcon className="h-6 w-6 text-green-500" />;
  }
};

type TransactionProps = {
  transaction: TransactionStream;
  selectedTransactions: Set<string>;
  toggleTransaction: (streamId: string) => void;
};

const TransactionCard = ({
  transaction,
  selectedTransactions,
  toggleTransaction,
}: TransactionProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedTransactions.has(transaction.stream_id)}
            onCheckedChange={() => toggleTransaction(transaction.stream_id)}
          />
          <CardTitle className="text-sm font-medium">
            {transaction.merchant_name}
          </CardTitle>
        </div>
        <Badge variant={transaction.is_active ? "default" : "secondary"}>
          {transaction.is_active ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(transaction.category)}
            <span className="text-sm text-muted-foreground">
              {transaction.category.join(" > ")}
            </span>
          </div>
          <div className="text-2xl font-bold">
            {transaction.last_amount?.amount &&
              transaction.last_amount?.iso_currency_code && (
                <span>
                  {formatCurrency(
                    transaction.last_amount.amount / 100,
                    transaction.last_amount.iso_currency_code,
                  )}
                </span>
              )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Frequency
            </span>
            <span className="text-sm">
              {transaction.frequency.toLowerCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Last Transaction
            </span>
            <span className="text-sm">{formatDate(transaction.last_date)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              Next Predicted
            </span>
            <span className="text-sm">
              {formatDate(transaction.predicted_next_date)}
            </span>
          </div>
          <div className="flex flex-col">
            {transaction.average_amount?.amount &&
              transaction.average_amount?.iso_currency_code && (
                <>
                  <span className="text-sm font-medium text-muted-foreground">
                    Average Amount
                  </span>
                  <span className="text-sm">
                    {formatCurrency(
                      transaction.average_amount.amount / 100,
                      transaction.average_amount.iso_currency_code,
                    )}
                  </span>
                </>
              )}
          </div>
          <div className="flex flex-col">
            {transaction.last_amount?.amount && (
              <>
                <span className="text-sm font-medium text-muted-foreground">
                  Last Amount
                </span>
                <span className="text-sm">
                  {formatCurrency(
                    transaction.last_amount.amount / 100,
                    transaction.last_amount.iso_currency_code ?? "GBP",
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RecurringTransactions() {
  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const utils = api.useUtils();
  const { data: transactions, isLoading } =
    api.service.getRecurringTransactions.useQuery<TransactionStream[]>();

  const { mutate: importTransactions, isPending: isImporting } =
    api.service.importTransactions.useMutation({
      onSuccess: () => {
        void utils.service.getRecurringTransactions.invalidate();
      },
    });

  useEffect(() => {
    if (transactions) {
      setSelectedTransactions(new Set(transactions.map((t) => t.stream_id)));
    }
  }, [transactions]);

  const handleSelectAll = (checked: boolean) => {
    if (checked && transactions) {
      setSelectedTransactions(new Set(transactions.map((t) => t.stream_id)));
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const toggleTransaction = (streamId: string) => {
    setSelectedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(streamId)) {
        newSet.delete(streamId);
      } else {
        newSet.add(streamId);
      }
      return newSet;
    });
  };

  const SimpleTableView = () => (
    <div className="relative">
      <Table>
        <TableHeader className="sticky top-0 z-10 border-b bg-background">
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={transactions?.length === selectedTransactions.size}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.stream_id}>
              <TableCell>
                <Checkbox
                  checked={selectedTransactions.has(transaction.stream_id)}
                  onCheckedChange={() =>
                    toggleTransaction(transaction.stream_id)
                  }
                />
              </TableCell>
              <TableCell>{transaction.merchant_name}</TableCell>
              <TableCell>
                <Badge
                  variant={transaction.is_active ? "default" : "secondary"}
                >
                  {transaction.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{transaction.category.join(" > ")}</TableCell>
              <TableCell>
                {transaction.last_amount?.amount &&
                  formatCurrency(
                    transaction.last_amount.amount / 100,
                    transaction.last_amount.iso_currency_code ?? "GBP",
                  )}
              </TableCell>
              <TableCell>{transaction.frequency.toLowerCase()}</TableCell>
              <TableCell>
                {formatDate(transaction.predicted_next_date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Recurring Transactions</h1>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={transactions?.length === selectedTransactions.size}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              importTransactions({
                streamIds: Array.from(selectedTransactions),
              })
            }
            disabled={selectedTransactions.size === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setViewMode(viewMode === "detailed" ? "simple" : "detailed")
            }
          >
            {viewMode === "detailed" ? "Compact View" : "Detailed View"}
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {isLoading && <div>Loading...</div>}
        {!isLoading &&
          viewMode === "detailed" &&
          transactions?.map((transaction) => (
            <TransactionCard
              key={transaction.stream_id}
              transaction={transaction}
              selectedTransactions={selectedTransactions}
              toggleTransaction={toggleTransaction}
            />
          ))}
        {!isLoading && viewMode === "simple" && <SimpleTableView />}
      </ScrollArea>
    </div>
  );
}
