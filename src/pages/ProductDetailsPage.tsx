import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProductById, clearCurrentProduct } from '../features/products/productSlice';
import { useCart } from '../utils/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector((state) => state.products);
  const { addToCart, isInCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Sync selected index with carousel selection
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setSelectedImageIndex(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on('select', onSelect);
    return () => {
      // embla types don't expose typed off; cast to any
      (carouselApi as any).off('select', onSelect);
    };
  }, [carouselApi]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-neutral-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Button onClick={handleBackClick} className="bg-medical-green-600 hover:bg-medical-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Prepare images array for carousel
  const allImages = [
    ...(currentProduct.images?.map(img => img.url) || [])
  ].filter(Boolean);

  const hasDiscount = currentProduct.discountPrice && 
  currentProduct.discountPrice < currentProduct.price;

  const discountPercentage = hasDiscount 
    ? Math.round((currentProduct.price - currentProduct.discountPrice!) / currentProduct.price) * 100
    : 0;

  const handleThumbClick = (index: number) => {
    setSelectedImageIndex(index);
    carouselApi?.scrollTo(index);
  };

  return (
    <div className="min-h-screen  to-transparent py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="mb-6 text-medical-green-600 hover:text-medical-green-700 hover:bg-medical-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Carousel */}
          <div className="space-y-4">
            <Carousel opts={{
              align: "start",
              loop: true,
            }} className="w-full" setApi={setCarouselApi}>
              <CarouselContent>
                {allImages.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-white rounded-lg border border-neutral-200 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${currentProduct.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>

            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex
                        ? 'border-medical-green-500 shadow-md'
                        : 'border-neutral-200 hover:border-medical-green-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${currentProduct.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {currentProduct.isFeatured && (
                  <Badge variant="secondary" className="bg-medical-green-100 text-medical-green-700 border-medical-green-200">
                    Featured
                  </Badge>
                )}
                {currentProduct.prescriptionRequired === 'yes' && (
                  <Badge variant="secondary" className="bg-medical-blue-100 text-medical-blue-700 border-medical-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Prescription Required
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                {currentProduct.name}
              </h1>
              
              <div className="flex items-center gap-2 text-neutral-600 mb-4">
                <span className="text-sm">SKU: {currentProduct.sku}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Category: {currentProduct.categoryId || 'Uncategorized'}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-medical-green-600">
                  रु{currentProduct.discountPrice || currentProduct.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-neutral-400 line-through">
                      रु{currentProduct.price}
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentProduct.stock > currentProduct.minStock 
                  ? 'bg-medical-green-500' 
                  : currentProduct.stock > 0 
                    ? 'bg-medical-orange-500' 
                    : 'bg-red-500'
              }`}></div>
              <span className={`text-sm font-medium ${
                currentProduct.stock > currentProduct.minStock 
                  ? 'text-medical-green-600' 
                  : currentProduct.stock > 0 
                    ? 'text-medical-orange-600' 
                    : 'text-red-600'
              }`}>
                {currentProduct.stock > currentProduct.minStock 
                  ? 'In Stock' 
                  : currentProduct.stock > 0 
                    ? 'Low Stock' 
                    : 'Out of Stock'
                }
              </span>
              <span className="text-sm text-neutral-500">
                ({currentProduct.stock} available)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <LiquidButton 
                className="flex items-center justify-center w-full h-12 text-black rounded-lg backdrop:bg-medical-green-100"
                disabled={currentProduct.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <p>{isInCart(currentProduct.id) ? "In Cart" : "Add to Cart"}</p>
              </LiquidButton>
              
              
            </div>

            <Separator />

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800">Product Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentProduct.manufacturer && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-medical-green-600" />
                    <span className="text-neutral-600">Manufacturer:</span>
                    <span className="font-medium">{currentProduct.manufacturer}</span>
                  </div>
                )}
                
                {currentProduct.batchNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-medical-green-600" />
                    <span className="text-neutral-600">Batch Number:</span>
                    <span className="font-medium">{currentProduct.batchNumber}</span>
                  </div>
                )}
                
                {currentProduct.expiryDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-medical-green-600" />
                    <span className="text-neutral-600">Expiry Date:</span>
                    <span className="font-medium">
                      {new Date(currentProduct.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-medical-green-600" />
                  <span className="text-neutral-600">Minimum Stock:</span>
                  <span className="font-medium">{currentProduct.stock}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {currentProduct.description && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-800">Description</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>
              </>
            )}

            {/* Short Description */}
            {currentProduct.shortDescription && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-neutral-800">Quick Overview</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {currentProduct.shortDescription}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
