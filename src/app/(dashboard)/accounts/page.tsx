import { AccountsList } from '@/components/accounts-list'
import { AddAccountForm } from '@/components/add-account-form'

export default function AccountsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
          <AddAccountForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
          <AccountsList />
        </div>
      </div>
    </div>
  )
}
