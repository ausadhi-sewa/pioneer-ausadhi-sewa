
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { couponApi, type ValidateCouponResponse } from "@/api/couponApi"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

// Accept a relaxed item shape to support both backend and local cart items
type AnyCartItem = { quantity: number; product: { name: string; profileImgUrl?: string | null } }

interface OrderSummaryProps {
  items: AnyCartItem[];
  subtotal: number;
  delivery: number;
  onCouponApplied?: (coupon: ValidateCouponResponse | null) => void;
}

export function OrderSummary({ items, subtotal, delivery, onCouponApplied }: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    setIsValidating(true)
    try {
      const result = await couponApi.validateCoupon({
        code: couponCode.trim(),
        orderAmount: subtotal
      })

      if (result.isValid) {
        setAppliedCoupon(result)
        onCouponApplied?.(result)
        toast.success("Coupon applied successfully!")
      } else {
        toast.error(result.error || "Invalid coupon code")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to validate coupon")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    onCouponApplied?.(null)
    toast.success("Coupon removed")
  }

  const discountAmount = appliedCoupon?.discountAmount || 0
  const total = subtotal + delivery - discountAmount

  return (
    <Card className="border-teal-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Order summary</h2>

      <div className="space-y-4">
        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-white">
              {items[0].product.profileImgUrl && (
                <img
                  src={items[0].product.profileImgUrl}
                  alt={items[0].product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{items[0].product.name}</p>
              <p className="text-xs text-slate-600">Qty: {items[0].quantity}</p>
            </div>
            <span className="text-sm font-medium text-slate-900">रु{subtotal.toFixed(2)}</span>
          </div>
        )}

        <div className="space-y-2">
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    {appliedCoupon.coupon?.code} applied
                  </p>
                  <p className="text-xs text-green-700">
                    {appliedCoupon.coupon?.type === 'percentage' 
                      ? `${appliedCoupon.coupon.value}% off`
                      : `रु${appliedCoupon.coupon?.value} off`
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-700 hover:text-green-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input 
                type="text" 
                placeholder="Discount code" 
                className="bg-white"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <Button 
                variant="secondary" 
                className="border-slate-200 bg-accent hover:bg-medical-green-300 hover:drop-shadow-accent"
                onClick={handleApplyCoupon}
                disabled={isValidating || !couponCode.trim()}
              >
                {isValidating ? "Validating..." : "Apply"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-900">रु{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Shipping</span>
            <span className="text-slate-900">रु{delivery.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>Discount</span>
              <span>-रु{discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t pt-3">
          <span className="text-base font-semibold text-slate-900">Total</span>
          <div className="text-right">
            <p className="text-xs text-slate-500">INR</p>
            <p className="text-lg font-semibold text-slate-900">रु{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
