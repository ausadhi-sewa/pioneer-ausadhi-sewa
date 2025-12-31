// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Eye,
//   Printer,
//   User,
//   MoreHorizontal,
// } from 'lucide-react';
// import type { OrderTableProps, OrderStatusOptions, PaymentStatus } from './types';

// const orderStatuses: OrderStatusOptions[] = [
//   {
//     value: "pending",
//     label: "Pending",
//     color: "bg-yellow-100 text-yellow-800",
//   },
//   {
//     value: "confirmed",
//     label: "Confirmed",
//     color: "bg-blue-100 text-blue-800",
//   },
//   {
//     value: "processing",
//     label: "Processing",
//     color: "bg-purple-100 text-purple-800",
//   },
//   {
//     value: "out_for_delivery",
//     label: "Out for Delivery",
//     color: "bg-indigo-100 text-indigo-800",
//   },
//   {
//     value: "delivered",
//     label: "Delivered",
//     color: "bg-green-100 text-green-800",
//   },
//   { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
//   {
//     value: "returned",
//     label: "Returned",
//     color: "bg-orange-100 text-orange-800",
//   },
// ];

// const paymentStatuses: PaymentStatus[] = [
//   {
//     value: "pending",
//     label: "Pending",
//     color: "bg-yellow-100 text-yellow-800",
//   },
//   { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
//   { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
//   { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
// ];

// export default function OrderTable({
//   orders,
//   selectedOrder,
//   showStaffAssignment,
//   staffId,
//   onOrderSelect,
//   onStatusUpdate,
//   onPaymentStatusUpdate,
//   onAssignStaff,
//   onPrintOrder,
//   onShowStaffAssignment,
//   onStaffIdChange,
// }: OrderTableProps) {
//   const getStatusBadge = (status: string, type: "order" | "payment") => {
//     const statusList = type === "order" ? orderStatuses : paymentStatuses;
//     const statusInfo = statusList.find((s) => s.value === status);
//     return statusInfo ? (
//       <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
//     ) : (
//       <Badge variant="secondary">{status}</Badge>
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <Card className="bg-transparent">
//       <CardHeader>
//         <CardTitle>Orders</CardTitle>
//         <CardDescription>
//           Manage and track all customer orders
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Order #</TableHead>
//               <TableHead>Customer</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Payment</TableHead>
//               <TableHead>Items</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orders.map((order) => (
//               <TableRow key={order.id}>
//                 <TableCell className="font-medium">{order.orderNumber}</TableCell>
//                 <TableCell>
//                   <div>
//                     <div className="font-medium">
//                       {order.address.fullName}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {order.address.phoneNumber}
//                     </div>
                     
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="text-sm">{formatDate(order.createdAt)}</div>
//                 </TableCell>
//                 <TableCell>{getStatusBadge(order.status, "order")}</TableCell>
//                 <TableCell>
//                   <div className="space-y-1">
//                     {getStatusBadge(order.paymentStatus, "payment")}
//                     <div className="text-xs text-gray-500 capitalize">
//                       {order.paymentMethod.replace("_", " ")}
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="text-sm">
//                     {order.items.length} item
//                     {order.items.length !== 1 ? "s" : ""}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="font-medium">रु{order.total}</div>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" className="h-8 w-8 p-0">
//                         <span className="sr-only">Open menu</span>
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                       <DropdownMenuItem
//                         onClick={() =>
//                           onOrderSelect(
//                             selectedOrder?.id === order.id ? null : order
//                           )
//                         }
//                       >
//                         <Eye className="mr-2 h-4 w-4" />
//                         {selectedOrder?.id === order.id
//                           ? "Hide"
//                           : "View"}{" "}
//                         Details
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={() => onPrintOrder(order)}
//                       >
//                         <Printer className="mr-2 h-4 w-4" />
//                         Print Order
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuLabel>Update Status</DropdownMenuLabel>
//                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                         <div className="w-full">
//                           <Label className="text-xs">Order Status</Label>
//                           <Select
//                             value={order.status}
//                             onValueChange={(value) =>
//                               onStatusUpdate(order.id, value)
//                             }
//                           >
//                             <SelectTrigger className="w-full mt-1">
//                               <SelectValue placeholder="Order Status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {orderStatuses.map((status) => (
//                                 <SelectItem
//                                   key={status.value}
//                                   value={status.value}
//                                 >
//                                   {status.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//                         <div className="w-full">
//                           <Label className="text-xs">Payment Status</Label>
//                           <Select
//                             value={order.paymentStatus}
//                             onValueChange={(value) =>
//                               onPaymentStatusUpdate(order.id, value)
//                             }
//                           >
//                             <SelectTrigger className="w-full mt-1">
//                               <SelectValue placeholder="Payment Status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {paymentStatuses.map((status) => (
//                                 <SelectItem
//                                   key={status.value}
//                                   value={status.value}
//                                 >
//                                   {status.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuLabel>Staff Assignment</DropdownMenuLabel>
//                       {showStaffAssignment === order.id ? (
//                         <DropdownMenuItem
//                           onSelect={(e) => e.preventDefault()}
//                         >
//                           <div className="space-y-2 w-full">
//                             <Input
//                               placeholder="Enter staff ID"
//                               value={staffId}
//                               onChange={(e) => onStaffIdChange(e.target.value)}
//                               className="w-full"
//                             />
//                             <div className="flex space-x-1">
//                               <Button
//                                 size="sm"
//                                 onClick={() => onAssignStaff(order.id)}
//                                 className="text-xs"
//                               >
//                                 Assign
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => {
//                                   onShowStaffAssignment(null);
//                                   onStaffIdChange("");
//                                 }}
//                                 className="text-xs"
//                               >
//                                 Cancel
//                               </Button>
//                             </div>
//                           </div>
//                         </DropdownMenuItem>
//                       ) : (
//                         <DropdownMenuItem
//                           onClick={() => onShowStaffAssignment(order.id)}
//                         >
//                           <User className="mr-2 h-4 w-4" />
//                           Assign Staff
//                         </DropdownMenuItem>
//                       )}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Printer,
  User,
  MoreHorizontal,
} from 'lucide-react';
import type { OrderTableProps, OrderStatusOptions, PaymentStatus } from './types';

const orderStatuses: OrderStatusOptions[] = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "returned",
    label: "Returned",
    color: "bg-orange-100 text-orange-800",
  },
];

const paymentStatuses: PaymentStatus[] = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
];

export default function OrderTable({
  orders,
  selectedOrder,
  showStaffAssignment,
  staffId,
  onOrderSelect,
  onStatusUpdate,
  onPaymentStatusUpdate,
  onAssignStaff,
  onPrintOrder,
  onShowStaffAssignment,
  onStaffIdChange,
}: OrderTableProps) {
  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statusList = type === "order" ? orderStatuses : paymentStatuses;
    const statusInfo = statusList.find((s) => s.value === status);
    return statusInfo ? (
      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
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

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          Manage and track all customer orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.address.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.address.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(order.createdAt)}</div>
                  </TableCell>
                  
                  {/* Order Status Column - Now with inline Select */}
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => onStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-${status.color}`} />
                              {getStatusBadge(status.value, "order")}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Payment Status Column - Now with inline Select */}
                  <TableCell>
                    <div className="space-y-1">
                      <Select
                        value={order.paymentStatus}
                        onValueChange={(value) => onPaymentStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatuses.map((status) => (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              className={`text-center`}
                            >
                              <div className="flex items-center gap-">
                                <div className={`w-2 h-2 rounded-full `} />
                                {getStatusBadge(status.value, "payment")}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs  text-gray-500 capitalize">
                        {order.paymentMethod.toUpperCase().replaceAll("_", " ")}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">Rs {order.total}</div>
                  </TableCell>
                  
                  {/* Actions Column - Simplified to only essential actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onOrderSelect(
                              selectedOrder?.id === order.id ? null : order
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {selectedOrder?.id === order.id
                            ? "Hide"
                            : "View"}{" "}
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onPrintOrder(order)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Staff Assignment</DropdownMenuLabel>
                        {showStaffAssignment === order.id ? (
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="space-y-2 w-full">
                              <Input
                                placeholder="Enter staff ID"
                                value={staffId}
                                onChange={(e) => onStaffIdChange(e.target.value)}
                                className="w-full"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => onAssignStaff(order.id)}
                                  className="text-xs"
                                >
                                  Assign
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    onShowStaffAssignment(null);
                                    onStaffIdChange("");
                                  }}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onShowStaffAssignment(order.id)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Assign Staff
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}