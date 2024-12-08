import { PaymentMethodList } from '@/components/payment-method-list'
import { AddPaymentMethodForm } from '@/components/add-payment-method-form'

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Payment Methods</h1>
      <p className="text-gray-600 mb-8">
        Your payment information is used solely for tracking purposes to help you identify the source of payments. 
        We will never charge your payment methods without your explicit consent or use this information for any other purpose.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Payment Method</h2>
          <AddPaymentMethodForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>
          <PaymentMethodList />
        </div>
      </div>
    </div>
  )
}
