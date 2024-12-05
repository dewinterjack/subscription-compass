'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

export function AddAccountForm() {
  const router = useRouter()
  const [accountType, setAccountType] = useState('bank')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    // For this example, we'll just simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.info(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account "${accountName}" has been added.`)

    // Reset form and refresh the page
    setAccountName('')
    setAccountNumber('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup value={accountType} onValueChange={setAccountType} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank" id="bank" />
          <Label htmlFor="bank">Bank Account</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card">Card</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">
          {accountType === 'bank' ? 'Account Number' : 'Card Number'}
        </Label>
        <Input
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
      </div>

      <Button type="submit">Add Account</Button>
    </form>
  )
}
