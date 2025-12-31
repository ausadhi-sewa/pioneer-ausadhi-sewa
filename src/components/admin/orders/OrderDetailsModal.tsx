import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package } from 'lucide-react';
import type { OrderDetailsModalProps } from './types';

export default function OrderDetailsModal({ order }: OrderDetailsModalProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mt-6 bg-transparent">
      <CardHeader>
        <CardTitle>Order Details - {order.orderNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Customer Information</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {order.address.fullName}
              </p>
              <p>
                <strong>Phone:</strong> {order.address.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong>
              </p>
              <p className="ml-4">{order.address.addressLine1}</p>
              {order.address.addressLine2 && (
                <p className="ml-4">{order.address.addressLine2}</p>
              )}
              <p className="ml-4">
                {order.address.city},{" "}
                {order.address.district},{" "}
                {order.address.province}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Order Information</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Order Date:</strong>{" "}
                {formatDate(order.createdAt)}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod.replace("_", " ")}
              </p>
              <p>
                <strong>Subtotal:</strong> रु{order.subtotal}
              </p>
              <p>
                <strong>Delivery Fee:</strong> रु{order.deliveryFee}
              </p>
              <p>
                <strong>Discount:</strong> रु{order.discount}
              </p>
              <p>
                <strong>Total:</strong> रु{order.total}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h4 className="font-medium mb-2">Order Items</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
              >
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  {item.product.profileImgUrl ? (
                    <img
                      src={item.product.profileImgUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Package className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">रु{item.total}</p>
              </div>
            ))}
          </div>
        </div>

        {order.specialInstructions && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium mb-2">Special Instructions</h4>
              <p className="text-sm text-gray-700">
                {order.specialInstructions}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
