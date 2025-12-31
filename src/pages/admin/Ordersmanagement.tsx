import { useState, useEffect } from "react";
import { orderApi, type Order, type OrderFilters } from "../../api/orderApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, Package } from "lucide-react";
import {
  OrderFilters as OrderFiltersComponent,
  OrderTable,
  OrderDetailsModal,
  OrderPagination,
} from "../../components/admin/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 20,
    status: undefined,
    paymentStatus: undefined,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStaffAssignment, setShowStaffAssignment] = useState<string | null>(
    null
  );
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    loadOrders();
 
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await orderApi.getAllOrders(filters);
      setOrders(result.orders);
    } catch (error: any) {
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (orderId: string, status: string) => {
    if (!status || status.trim() === "") {
      setError("Invalid status value");
      return;
    }

    try {
      await orderApi.updateOrderStatus(orderId, status);
      loadOrders(); // Reload orders

    } catch (error: any) {
      setError(error.message || "Failed to update order status");
    }
  };

  const handlePaymentStatusUpdate = async (
    orderId: string,
    paymentStatus: string
  ) => {
    if (!paymentStatus || paymentStatus.trim() === "") {
      setError("Invalid payment status value");
      return;
    }

    try {
      await orderApi.updatePaymentStatus(orderId, paymentStatus);
      loadOrders(); // Reload orders
    } catch (error: any) {
      setError(error.message || "Failed to update payment status");
    }
  };

  const handleAssignStaff = async (orderId: string) => {
    if (!staffId || !staffId.trim()) {
      setError("Please enter a staff ID");
      return;
    }

    try {
      await orderApi.assignOrderToStaff(orderId, staffId.trim());
      setShowStaffAssignment(null);
      setStaffId("");
      loadOrders(); // Reload orders
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to assign staff");
    }
  };

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              .total { font-weight: bold; font-size: 18px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Details</h1>
              <h2>Order #${order.orderNumber}</h2>
            </div>
            <div class="order-info">
              <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              <p><strong>Payment Method:</strong> ${
                order.paymentMethod === "cash_on_delivery"
                  ? "Cash on Delivery"
                  : "Online Payment"
              }</p>
            </div>
            <div class="items">
              <h3>Order Items:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>${item.quantity}</td>
                      <td>रु${item.price}</td>
                      <td>रु${item.total}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div class="total">
              <p>Subtotal: रु${order.subtotal}</p>
              <p>Delivery Fee: रु${order.deliveryFee}</p>
              <p>Discount: रु${order.discount}</p>
              <p>Total: रु${order.total}</p>
            </div>
            <div class="address">
              <h3>Delivery Address:</h3>
              <p>${order.address.fullName}</p>
              <p>${order.address.phoneNumber}</p>
              <p>${order.address.addressLine1}</p>
              ${
                order.address.addressLine2
                  ? `<p>${order.address.addressLine2}</p>`
                  : ""
              }
              <p>${order.address.city}, ${order.address.district}, ${
        order.address.province
      }</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportOrders = () => {
    const csvContent = [
      [
        "Order Number",
        "Date",
        "Customer",
        "Phone",
        "Status",
        "Payment Status",
        "Total",
        "Items",
      ],
      ...orders.map((order) => [
        order.id,
        formatDate(order.createdAt),
        order.address.fullName,
        order.address.phoneNumber,
        order.status,
        order.paymentStatus,
        order.total,
        order.items.length,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <OrderFiltersComponent 
        filters={filters}
        onFiltersChange={setFilters}
        onExportOrders={handleExportOrders}
      />

      <OrderTable
        orders={orders}
        loading={loading}
        selectedOrder={selectedOrder}
        showStaffAssignment={showStaffAssignment}
        staffId={staffId}
        onOrderSelect={setSelectedOrder}
        onStatusUpdate={handleStatusUpdate}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        onAssignStaff={handleAssignStaff}
        onPrintOrder={handlePrintOrder}
        onShowStaffAssignment={setShowStaffAssignment}
        onStaffIdChange={setStaffId}
      />

      <OrderDetailsModal 
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {orders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}

      {orders.length > 0 && (
        <OrderPagination
          currentPage={filters.page || 1}
          totalItems={orders.length}
          itemsPerPage={filters.limit || 20}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
