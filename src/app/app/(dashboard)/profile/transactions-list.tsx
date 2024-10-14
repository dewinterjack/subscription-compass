"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Globe,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const TransactionsList = () => {
  const { data: transactions } = api.service.getTransactions.useQuery();
  const { data: recurringTransactions } =
    api.service.getRecurringTransactions.useQuery();
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );

  const toggleTransaction = (transactionId: string) => {
    setExpandedTransaction(
      expandedTransaction === transactionId ? null : transactionId,
    );
  };

  return (
    <div className="container mx-auto w-[800px] space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest account activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.added.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={transaction.logo_url}
                          alt={transaction.merchant_name}
                        />
                        <AvatarFallback>
                          {transaction.merchant_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{transaction.merchant_name}</span>
                    </TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transaction.personal_finance_category?.primary}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.pending ? "outline" : "default"}
                      >
                        {transaction.pending ? "Pending" : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          toggleTransaction(transaction.transaction_id)
                        }
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        {expandedTransaction === transaction.transaction_id ? (
                          <ChevronUp className="mr-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="mr-1 h-4 w-4" />
                        )}
                        {expandedTransaction === transaction.transaction_id
                          ? "Hide"
                          : "Show"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {expandedTransaction && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions?.added.map((transaction) => {
              if (expandedTransaction === transaction.transaction_id) {
                return (
                  <div key={transaction.transaction_id} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <p className="font-semibold">
                        Amount: ${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <p>Payment Method: {transaction.payment_channel}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <p>Authorized Date: {transaction.authorized_date}</p>
                    </div>
                    {transaction.location.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="mt-1 h-5 w-5 text-red-500" />
                        <p>
                          Location: {transaction.location.address},{" "}
                          {transaction.location.city},{" "}
                          {transaction.location.region}{" "}
                          {transaction.location.postal_code}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-cyan-500" />
                      {transaction.website ? (
                        <Link
                          href={
                            transaction.website.startsWith("http")
                              ? transaction.website
                              : `https://${transaction.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {transaction.website}
                        </Link>
                      ) : (
                        <span className="text-gray-500">No website</span>
                      )}
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {transaction.counterparties?.map(
                          (counterparty, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 rounded bg-gray-100 p-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={counterparty.logo_url}
                                  alt={counterparty.name}
                                />
                                <AvatarFallback>
                                  {counterparty.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {counterparty.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {counterparty.type}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={transaction.personal_finance_category_icon_url}
                          alt={transaction.personal_finance_category?.primary}
                        />
                        <AvatarFallback>
                          {transaction.personal_finance_category?.primary?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">
                        Personal Finance Category:
                      </p>
                      <p>
                        {transaction.personal_finance_category?.detailed}{" "}
                        (Confidence:{" "}
                        {
                          transaction.personal_finance_category
                            ?.confidence_level
                        }
                        )
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </CardContent>
        </Card>
      )}

      {/* Item Information */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Details about your linked account</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Institution ID: {plaidResponse.item.institution_id}</p>
          <p>
            Available Products:{" "}
            {plaidResponse.item.available_products.join(", ")}
          </p>
          <p>
            Billed Products: {plaidResponse.item.billed_products.join(", ")}
          </p>
          <p>Last Update: {plaidResponse.item.update_type}</p>
        </CardContent>
      </Card> */}

      {/* Request Information */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Request ID: {plaidResponse.request_id}</p>
          <p>Total Transactions: {plaidResponse.total_transactions}</p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default TransactionsList;
