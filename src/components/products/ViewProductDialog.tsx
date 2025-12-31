import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/api/productApi";

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function ViewProductDialog({ open, onOpenChange, product }: ViewProductDialogProps) {
  // const formatPrice = (price: string) => {
  //   return `रु${parseFloat(price).toFixed(2)}`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View complete information about the product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            {product.profileImgUrl ? (
              <img
                src={product.profileImgUrl}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-48 h-48 bg-neutral-200 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500">No Image</span>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-neutral-600">{product.manufacturer}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-600">SKU</p>
                <p className="font-mono text-sm">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Price</p>
                <p className="text-lg font-semibold text-medical-green-600">
                  {`रु${product.price}`}
                </p>
                {product.discountPrice && (
                  <p className="text-sm text-red-600 line-through">
                    {`रु${product.discountPrice}`}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-600">Stock</p>
                <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Minimum Stock</p>
                <p className="font-semibold">{product.minStock}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Badges */}
          <div className="space-y-3">
            <h4 className="font-medium">Status</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              {product.isFeatured && (
                <Badge variant="outline">Featured</Badge>
              )}
              {product.prescriptionRequired === "yes" && (
                <Badge variant="outline" className="text-blue-600">
                  Prescription Required
                </Badge>
              )}
              {product.stock <= product.minStock && (
                <Badge variant="destructive">Low Stock</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Descriptions */}
          <div className="space-y-4">
            {product.shortDescription && (
              <div>
                <h4 className="font-medium mb-2">Short Description</h4>
                <p className="text-sm text-neutral-700">{product.shortDescription}</p>
              </div>
            )}

            {product.description && (
              <div>
                <h4 className="font-medium mb-2">Full Description</h4>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Additional Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.batchNumber && (
                <div>
                  <p className="font-medium text-neutral-600">Batch Number</p>
                  <p>{product.batchNumber}</p>
                </div>
              )}
              {product.expiryDate && (
                <div>
                  <p className="font-medium text-neutral-600">Expiry Date</p>
                  <p>{formatDate(product.expiryDate)}</p>
                </div>
              )}
              <div>
                <p className="font-medium text-neutral-600">Created</p>
                <p>{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-neutral-600">Last Updated</p>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 