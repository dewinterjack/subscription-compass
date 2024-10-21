"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSignIcon, LightbulbIcon, ShoppingCartIcon } from "lucide-react";
import { api } from "@/trpc/react";
import type { TransactionStream as PlaidTransactionStream } from "plaid";

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
};

const TransactionCard = ({ transaction }: TransactionProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {transaction.merchant_name}
        </CardTitle>
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
  const { data: transactions, isLoading } =
    api.service.getRecurringTransactions.useQuery<TransactionStream[]>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Recurring Transactions</h1>
      {isLoading && <div>Loading...</div>}
      {transactions?.map((transaction) => (
        <TransactionCard
          key={transaction.stream_id}
          transaction={transaction}
        />
      ))}
    </div>
  );
}
