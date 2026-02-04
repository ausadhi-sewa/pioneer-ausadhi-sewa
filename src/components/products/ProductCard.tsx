import type { Product } from "@/api/productApi";
import { LiquidButton } from "../ui/liquid-glass-button";
import { Skeleton } from "../ui/skeleton";
import { Card ,CardContent} from "../ui/card";
import { ShoppingCart } from "lucide-react";


export default function ProductCard({
  product,
  handleProductClick,
  handleAddToCart,
  isLoading = false,
}: {
  product: Product;
  handleProductClick: (id: string) => void;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => void;
  isLoading?: boolean;
}) {
  return (
    <>
    {!isLoading ? (
        <div
        key={product.id}
        className=" border  rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group "
        onClick={() => handleProductClick(product.id)}
      >
        <div className="p-2 rounded-md ">
        {/* Product Image */}
        <div className="relative overflow-hidden flex justify-center  rounded-md items-center h-[220px] bg-white ">
          {product.profileImgUrl ? (
            <img
              src={product.profileImgUrl}
              alt={product.name}
              className="max-h-[200px] w-auto max-w-[92%] object-contain rounded-md"
            />
          ) : (
            <div className="w-[140px] h-[140px] flex items-center justify-center text-neutral-400 bg-neutral-200 rounded-lg">
              <span>No Image</span>
            </div>
          )}
        </div>
  </div>
        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-xl text-neutral-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="text-lg font-bold text-medical-green-600 mb-3">
            रु{product.discountPrice || product.price}
          </div>
          <LiquidButton
            className="text-black w-full h-10 rounded-full backdrop:bg-medical-green-100 hover:backdrop:bg-medical-green-200"
            onClick={(e) => handleAddToCart(e, product)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            ADD TO CART
          </LiquidButton>
        </div>
      </div>
    ):(<Card className="overflow-hidden">
        <Skeleton className="h-48 bg-gray-200 w-full" />
        <CardContent className="p-4">
          <Skeleton className="h-4 bg-gray-200 w-3/4 mb-2" />
          <Skeleton className="h-3 bg-gray-200 w-1/2 mb-3" />
          <Skeleton className="h-6 bg-gray-200 w-1/3 mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-4 bg-gray-200 w-20" />
            <Skeleton className="h-4 bg-gray-200 w-24" />
          </div>
        </CardContent>
      </Card>)}
  </>
  );
}
