"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ChevronDown, ChevronUp, CreditCard, DollarSign, Globe, MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";

const plaidResponse = {
  accounts: [
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      balances: {
        available: 110.94,
        current: 110.94,
        iso_currency_code: "USD",
        limit: null,
        unofficial_currency_code: null,
      },
      mask: "0000",
      name: "Plaid Checking",
      official_name: "Plaid Gold Standard 0% Interest Checking",
      subtype: "checking",
      type: "depository",
    },
  ],
  transactions: [
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      account_owner: null,
      amount: 28.34,
      iso_currency_code: "USD",
      unofficial_currency_code: null,
      category: ["Food and Drink", "Restaurants", "Fast Food"],
      category_id: "13005032",
      check_number: null,
      counterparties: [
        {
          name: "DoorDash",
          type: "marketplace",
          logo_url: "https://plaid-counterparty-logos.plaid.com/doordash_1.png",
          website: "doordash.com",
          entity_id: "YNRJg5o2djJLv52nBA1Yn1KpL858egYVo4dpm",
          confidence_level: "HIGH",
      },
      {
        name: "Burger King",
        type: "merchant",
        logo_url: "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
        website: "burgerking.com",
        entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
        confidence_level: "VERY_HIGH",
      },
      ],
      date: "2023-09-28",
      datetime: "2023-09-28T15:10:09Z",
      authorized_date: "2023-09-27",
      authorized_datetime: "2023-09-27T08:01:58Z",
      location: {
        address: null,
        city: null,
        region: null,
        postal_code: null,
        country: null,
        lat: null,
        lon: null,
        store_number: null,
      },
      name: "Dd Doordash Burgerkin",
      merchant_name: "Burger King",
      merchant_entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
      logo_url: "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
      website: "burgerking.com",
      payment_channel: "online",
      pending: true,
      pending_transaction_id: null,
      personal_finance_category: {
        primary: "FOOD_AND_DRINK",
        detailed: "FOOD_AND_DRINK_FAST_FOOD",
        confidence_level: "VERY_HIGH",
      },
      personal_finance_category_icon_url:
        "https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png",
      transaction_id: "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
      transaction_code: null,
      transaction_type: "digital",
    },
    {
      account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      account_owner: null,
      amount: 72.1,
      iso_currency_code: "USD",
      unofficial_currency_code: null,
      category: ["Shops", "Supermarkets and Groceries"],
      category_id: "19046000",
      check_number: null,
      counterparties: [
        {
          name: "Walmart",
          type: "merchant",
          logo_url: "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
          website: "walmart.com",
          entity_id: "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
          confidence_level: "VERY_HIGH",
        },
      ],
      date: "2023-09-24",
      datetime: "2023-09-24T11:01:01Z",
      authorized_date: "2023-09-22",
      authorized_datetime: "2023-09-22T10:34:50Z",
      location: {
        address: "13425 Community Rd",
        city: "Poway",
        region: "CA",
        postal_code: "92064",
        country: "US",
        lat: 32.959068,
        lon: -117.037666,
        store_number: "1700",
      },
      name: "PURCHASE WM SUPERCENTER #1700",
      merchant_name: "Walmart",
      merchant_entity_id: "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
      logo_url: "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
      website: "walmart.com",
      payment_channel: "in store",
      pending: false,
      pending_transaction_id: "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nc",
      personal_finance_category: {
        primary: "GENERAL_MERCHANDISE",
        detailed: "GENERAL_MERCHANDISE_SUPERSTORES",
        confidence_level: "VERY_HIGH",
      },
      personal_finance_category_icon_url:
        "https://plaid-category-icons.plaid.com/PFC_GENERAL_MERCHANDISE.png",
      transaction_id: "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      transaction_code: null,
      transaction_type: "place",
    },
  ],
  item: {
    available_products: ["balance", "identity", "investments"],
    billed_products: ["assets", "auth", "liabilities", "transactions"],
    consent_expiration_time: null,
    error: null,
    institution_id: "ins_3",
    item_id: "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
    update_type: "background",
    webhook: "https://www.genericwebhookurl.com/webhook",
  },
  total_transactions: 1,
  request_id: "45QSn",
};

export default function PlaidResponse() {
    const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)

    const toggleTransaction = (transactionId: string) => {
        setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId)
      }

      return (
        <div className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold mb-6">Plaid API Response</h1>
          
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Overview of your linked account</CardDescription>
            </CardHeader>
            <CardContent>
              {plaidResponse.accounts.map((account) => (
                <div key={account.account_id} className="space-y-2">
                  <h3 className="text-lg font-semibold">{account.official_name}</h3>
                  <p>Account Type: {account.type} ({account.subtype})</p>
                  <p>Account Number: ••••{account.mask}</p>
                  <div className="flex space-x-4">
                    <p>Available Balance: ${account.balances.available}</p>
                    <p>Current Balance: ${account.balances.current}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
    
          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest account activities</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {plaidResponse.transactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={transaction.logo_url} alt={transaction.merchant_name} />
                          <AvatarFallback>{transaction.merchant_name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{transaction.merchant_name}</span>
                      </TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.category[0]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.pending ? "outline" : "default"}>
                          {transaction.pending ? "Pending" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleTransaction(transaction.transaction_id)}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          {expandedTransaction === transaction.transaction_id ? (
                            <ChevronUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-1" />
                          )}
                          {expandedTransaction === transaction.transaction_id ? 'Hide' : 'Show'}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    
          {/* Expanded Transaction Details */}
          {expandedTransaction && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent>
                {plaidResponse.transactions.map((transaction) => {
                  if (expandedTransaction === transaction.transaction_id) {
                    return (
                      <div key={transaction.transaction_id} className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          <p className="font-semibold">Amount: ${transaction.amount.toFixed(2)}</p>
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
                            <MapPin className="h-5 w-5 text-red-500 mt-1" />
                            <p>
                              Location: {transaction.location.address}, {transaction.location.city}, {transaction.location.region} {transaction.location.postal_code}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-5 w-5 text-orange-500" />
                          <p>Category: {transaction.category.join(' > ')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-5 w-5 text-cyan-500" />
                          <a href={transaction.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {transaction.website}
                          </a>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Counterparties:</p>
                          <div className="grid grid-cols-2 gap-4">
                            {transaction.counterparties.map((counterparty, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={counterparty.logo_url} alt={counterparty.name} />
                                  <AvatarFallback>{counterparty.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{counterparty.name}</p>
                                  <p className="text-xs text-gray-500">{counterparty.type}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">Personal Finance Category:</p>
                          <p>{transaction.personal_finance_category.detailed} (Confidence: {transaction.personal_finance_category.confidence_level})</p>
                        </div>
                    
                      </div>
                    )
                  }
                  return null
                })}
              </CardContent>
            </Card>
          )}
    
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your linked account</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Institution ID: {plaidResponse.item.institution_id}</p>
              <p>Available Products: {plaidResponse.item.available_products.join(', ')}</p>
              <p>Billed Products: {plaidResponse.item.billed_products.join(', ')}</p>
              <p>Last Update: {plaidResponse.item.update_type}</p>
            </CardContent>
          </Card>
    
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Request ID: {plaidResponse.request_id}</p>
              <p>Total Transactions: {plaidResponse.total_transactions}</p>
            </CardContent>
          </Card>
        </div>
      )
    
}
