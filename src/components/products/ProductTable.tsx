import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import type { Product } from "../../api/productApi";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  isLoadingMore?: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductTable({
  products,
  loading,
  isLoadingMore = false,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">No products found. Add your first product to get started.</p>
      </div>
    );
  }

  // const formatPrice = (price: string) => {
  //   return `रु${parseFloat(price).toFixed(2)}`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && products.length === 0 && (
            <>
              {[...Array(5)].map((_, index) => (
                <TableRow key={`initial-skeleton-${index}`}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.profileImgUrl ? (
                  <img
                    src={product.profileImgUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-200 rounded-md flex items-center justify-center">
                    <span className="text-xs text-neutral-500">No Image</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-neutral-600">{product.manufacturer}</p>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  {product.sku}
                </code>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{`रु${product.price}`}</p>
                  {product.discountPrice && (
                    <p className="text-sm text-red-600 line-through">
                      {`रु${product.discountPrice}`}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock}
                  </span>
                  {product.stock <= product.minStock && (
                    <Badge variant="destructive" className="text-xs">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {product.isFeatured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                  {product.prescriptionRequired === "yes" && (
                    <Badge variant="outline" className="text-xs text-blue-600">
                      Prescription Required
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-neutral-600">
                  {formatDate(product.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(product)}
                    className="h-8 w-8 p-0"
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 p-0"
                  >
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {isLoadingMore && (
            <>
              {[...Array(3)].map((_, index) => (
                <TableRow key={`load-more-skeleton-${index}`}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
