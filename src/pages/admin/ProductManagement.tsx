import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../utils/hooks";

import {
  deleteProduct,
  fetchProducts,
  searchProducts,
} from "../../features/products/productSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Note: Tabs component needs to be created or imported from a UI library
// For now, we'll use a simple div-based tab implementation
import {
  IconCategory,
  IconUser,
  IconPackages,
  IconDiscount,
  IconSettings,
} from "@tabler/icons-react";
import { Search } from "lucide-react";
import { ProductTable } from "../../components/products/ProductTable";
import { AddProductDialog } from "../../components/products/AddProductDialog";
import { AddCategoryDialog } from "../../components/categories/AddCategoryDialog";
import { EditProductDialog } from "../../components/products/EditProductDialog";
import { ViewProductDialog } from "../../components/products/ViewProductDialog";
import CouponManagement from "../../components/admin/CouponManagement";
import DeliveryFeeSettings from "../../components/admin/DeliveryFeeSettings";
import { toast } from "sonner";
import type { ProductFilters } from "@/api/productApi";
import type { Product } from "@/api/productApi";

export default function DashboardPage() {

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { products, loading: productsLoading, pagination } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector(
    (state) => state.categories
  );

  // Dialog states
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Settings state
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data on mount
  useEffect(() => {
    if (!user || activeTab !== "products") return;

    if (debouncedSearchQuery) {
      dispatch(
        searchProducts({
          query: debouncedSearchQuery,
          filters,
        })
      );
      return;
    }

    dispatch(fetchProducts(filters));
  }, [dispatch, user, activeTab, filters, debouncedSearchQuery]);

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page ?? 1;

  useEffect(() => {
    if (activeTab !== "products") return;

    if (currentPage <= 1) {
      setVisibleProducts(products);
      return;
    }

    setVisibleProducts((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const nextProducts = products.filter((item) => !existingIds.has(item.id));
      return [...prev, ...nextProducts];
    });
  }, [products, currentPage, activeTab]);

  useEffect(() => {
    if (activeTab !== "products") return;
    setHasMoreProducts(totalPages > 0 && currentPage < totalPages);
  }, [totalPages, currentPage, activeTab]);

  useEffect(() => {
    if (activeTab !== "products") return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || productsLoading || !hasMoreProducts) return;
        setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }));
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [productsLoading, hasMoreProducts, activeTab]);

  useEffect(() => {
    if (activeTab !== "products") return;
    setVisibleProducts([]);
    setHasMoreProducts(true);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [activeTab, debouncedSearchQuery]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewProductOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        setVisibleProducts((prev) => prev.filter((product) => product.id !== productId));
       
      } catch {
       toast.error("Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-medical-green-500 border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-green-50 to-medical-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">
              Admin Dashboard
            </h1>
            <p className="text-neutral-600">Welcome back, {user.name}!</p>
          </div>
         {/* Action Buttons */}
         <div className="flex gap-4">
                <Button
                  onClick={() => setAddProductOpen(true)}
                  className="flex rounded-2xl items-center gap-2 bg-accent hover:bg-medical-green-500"
                >
                  <IconPackages stroke={2} className="w-4 h-4" />
                List Products
                </Button>
                <Button
                  onClick={() => setAddCategoryOpen(true)}
                  variant="outline"
                  className="flex items-center bg-accent hover:bg-medical-green-500 rounded-2xl gap-2"
                >
                  < IconCategory stroke={2} className="w-4 h-4" />
                  List Categories
                </Button>
              </div>
        </div>

        

        {/* Main Content Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-medical-green-500 text-medical-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconUser className="w-4 h-4" />
                  Products
                </div>
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coupons'
                    ? 'border-medical-green-500 text-medical-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconDiscount className="w-4 h-4" />
                  Coupons
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-medical-green-500 text-medical-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconSettings className="w-4 h-4" />
                  Settings
                </div>
              </button>
             
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'products' && (
            <div className="space-y-6">
             

              {/* Products Table */}
              <Card className="bg-transparent">
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl">Product Management</CardTitle>
                    <div className="relative w-full lg:w-80">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductTable
                    products={visibleProducts}
                    loading={productsLoading}
                    isLoadingMore={productsLoading && visibleProducts.length > 0}
                    onView={handleViewProduct}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                  <div className="mt-4 flex justify-center">
                    {productsLoading && visibleProducts.length > 0 && (
                      <p className="text-sm text-neutral-500">Loading more products...</p>
                    )}
                    {!hasMoreProducts && visibleProducts.length > 0 && (
                      <p className="text-sm text-neutral-500">You have reached the end.</p>
                    )}
                  </div>
                  <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'coupons' && (
            <CouponManagement />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <DeliveryFeeSettings 
                currentFee={deliveryFee}
                onFeeUpdate={setDeliveryFee}
              />
            </div>
          )}

          
        </div>
      </div>

      {/* Dialogs */}
      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        categories={categories}
      />

      <AddCategoryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
      />

      {selectedProduct && (
        <>
          <EditProductDialog
            open={editProductOpen}
            onOpenChange={setEditProductOpen}
            product={selectedProduct}
            categories={categories}
          />

          <ViewProductDialog
            open={viewProductOpen}
            onOpenChange={setViewProductOpen}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
