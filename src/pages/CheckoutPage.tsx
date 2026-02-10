import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCart } from "../utils/hooks/useCart"
import { useAppDispatch, useAppSelector } from "../utils/hooks"
import { addressApi, type CreateAddressRequest } from "@/api/addressApi"
import { orderApi, type CreateOrderRequest } from "@/api/orderApi"
import { type ValidateCouponResponse } from "@/api/couponApi"

import { CheckoutForm, type CheckoutDetails } from "@/components/checkout/checkout-form"
import { ReviewAndPay } from "@/components/checkout/review-pay"
import { OrderSummary } from "@/components/checkout/order-summary"
import { fetchDeliveryFee } from "@/features/delivery/deliverySlice"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)
  const { fees, loading: deliveryLoading } = useAppSelector((s) => s.delivery)
  const { items, subtotal, clearCart } = useCart()
  const activeDeliveryFee = fees.find((item) => item.status === "active")?.fee ?? 0
  const delivery = activeDeliveryFee
  const [step, setStep] = useState<0 | 1>(0)
  const [details, setDetails] = useState<CheckoutDetails | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    if (!fees.length && !deliveryLoading) {
      dispatch(fetchDeliveryFee())
    }
  }, [dispatch, fees.length, deliveryLoading])

  return (
    <main className="min-h-screen ">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        <header className="mb-6 md:mb-8">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-slate-600">Securely complete your purchase. All data is encrypted.</p>
        </header>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[1fr_minmax(320px,420px)]">
          <div className="order-2 md:order-1">
            {step === 0 ? (
              <CheckoutForm
                onSubmit={(v) => {
                  const phoneRegex = /^(\+977|977)?[0-9]{10}$/
                  if (!phoneRegex.test(v.phone.trim())) {
                    toast.error("Please enter a valid Nepal phone number (10 digits)")
                    return
                  }
                  if (!v.city || v.city.toLowerCase().indexOf("birgunj") === -1) {
                    toast.error("Sorry, we currently deliver only in Birgunj. Rapidly expanding!")
                    return
                  }
                  setDetails(v)
                  setStep(1)
                }}
                        />
                      ) : (
              <ReviewAndPay
                details={details!}
                subtotal={subtotal}
                delivery={delivery}
                onBack={() => setStep(0)}
                onPlaceOrder={async () => {
                  try {
                    if (!details) return
                    const addressPayload: CreateAddressRequest = {
                      fullName: `${details.firstName} ${details.lastName}`.trim(),
                      phoneNumber: details.phone,
                      addressLine1: details.address,
                      addressLine2: details.address2 || undefined,
                      city: details.city,
                      district: details.state,
                      province: details.state,
                      postalCode: details.pin,
                      isDefault: details.save,
                      type: "delivery",
                    }
                    const address = await addressApi.createAddress(addressPayload)
                    const orderPayload: CreateOrderRequest = {
                      addressId: address.id,
                      paymentMethod: "cash_on_delivery",
                      specialInstructions: undefined,
                      discount: 0,
                      couponCode: appliedCoupon?.coupon?.code,
                    }
                    const order = await orderApi.createOrder(orderPayload)
                    clearCart()
                    toast.success("Order placed successfully!")
                    navigate(`/orders/${order.id}`)
                  } catch (e: any) {
                    toast.error(e?.response?.data?.error || e?.message || "Failed to place order")
                  }
                }}
              />
            )}
              </div>

          <aside className="order-1 md:order-2 md:pl-6">
            <div className="md:sticky md:top-6">
              <OrderSummary 
                items={items} 
                subtotal={subtotal} 
                delivery={delivery}
                onCouponApplied={setAppliedCoupon}
              />
                </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
