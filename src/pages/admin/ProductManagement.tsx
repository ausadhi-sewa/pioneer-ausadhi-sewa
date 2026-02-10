import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../utils/hooks";

import {
  deleteProduct,
  fetchProducts,
} from "../../features/products/productSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Note: Tabs component needs to be created or imported from a UI library
// For now, we'll use a simple div-based tab implementation
import {
  IconCategory,
  IconUser,
  IconPackages,
  IconDiscount,
  IconSettings,
} from "@tabler/icons-react";
import { ProductTable } from "../../components/products/ProductTable";
import { AddProductDialog } from "../../components/products/AddProductDialog";
import { AddCategoryDialog } from "../../components/categories/AddCategoryDialog";
import { EditProductDialog } from "../../components/products/EditProductDialog";
import { ViewProductDialog } from "../../components/products/ViewProductDialog";
import CouponManagement from "../../components/admin/CouponManagement";
import DeliveryFeeSettings from "../../components/admin/DeliveryFeeSettings";
import { toast } from "sonner";
import type { ProductFilters } from "@/api/productApi";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Settings state
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [activeTab, setActiveTab] = useState('products');
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });

  // Fetch data on mount
  useEffect(() => {
    if (user && activeTab === "products") {
      dispatch(fetchProducts(filters));
    }
  }, [dispatch, user, activeTab, filters]);

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page ?? filters.page ?? 1;

  const handlePageChange = (newPage: number) => {
    const safeTotalPages = totalPages || 1;
    const clampedPage = Math.min(Math.max(newPage, 1), safeTotalPages);
    setFilters((prev) => ({ ...prev, page: clampedPage }));
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewProductOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
       
      } catch (error) {
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
                  <CardTitle className="text-xl">Product Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductTable
                    products={products}
                    loading={productsLoading}
                    onView={handleViewProduct}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end mt-6 gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          const isCurrentPage = pageNumber === currentPage;

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                                isCurrentPage
                                  ? "bg-medical-green-500 text-white"
                                  : "border border-neutral-300 hover:bg-neutral-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
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
