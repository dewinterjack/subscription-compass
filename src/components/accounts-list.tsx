'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// This would typically come from your backend
const initialAccounts = [
  { id: 1, type: 'bank', name: 'Main Checking', number: '****1234' },
  { id: 2, type: 'card', name: 'Credit Card', number: '****5678' },
]

export function AccountsList() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number, newName: string) => {
    setAccounts(accounts.map(account =>
      account.id === id ? { ...account, name: newName } : account
    ))
    setEditingId(null)
    toast.info("The account has been successfully updated."
    )
  }

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id))
    toast("The account has been successfully removed.")
  }

  return (
    <div className="space-y-4">
      {accounts.map(account => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle>{account.type === 'bank' ? 'Bank Account' : 'Card'}</CardTitle>
          </CardHeader>
          <CardContent>
            {editingId === account.id ? (
              <div className="space-y-2">
                <Label htmlFor={`edit-${account.id}`}>Account Name</Label>
                <Input
                  id={`edit-${account.id}`}
                  defaultValue={account.name}
                  onBlur={(e) => handleSave(account.id, e.target.value)}
                />
              </div>
            ) : (
              <div>
                <p><strong>Name:</strong> {account.name}</p>
                <p><strong>Number:</strong> {account.number}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => handleEdit(account.id)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(account.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
