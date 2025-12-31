import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Grid, List, SlidersHorizontal, X, Star, ShoppingCart, Eye, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts, searchProducts } from '../features/products/productSlice';
import type { Product, ProductFilters } from '../api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../utils/hooks/useCart';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const { products, loading, pagination, error } = useAppSelector((state) => state.products);
  
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    prescription: '',
    inStock: null,
    featured: false,
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  // Debounced search with optimization
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  
  

  // API filters
  const apiFilters: ProductFilters = {
    page,
    limit: 12,
    sortBy: filters.sortBy as 'price' | 'createdAt' | 'name' | 'stock',
    order: filters.order,
    prescription: filters.prescription as 'yes' | 'no' | undefined,
    inStock: filters.inStock === null ? undefined : filters.inStock,
    featured: filters.featured || undefined,
    minPrice: filters.priceRange[0] || undefined,
    maxPrice: filters.priceRange[1] || undefined,
  };

  // Fetch products
  const fetchProductsData = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    const currentFilters = { ...apiFilters, page: currentPage };
    
    try {
      if (debouncedSearchQuery.trim()) {
        await dispatch(searchProducts({ 
          query: debouncedSearchQuery.trim(), 
          filters: currentFilters 
        })).unwrap();
      } else {
        await dispatch(fetchProducts(currentFilters)).unwrap();
      }
      
      if (resetPage) {
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [dispatch, apiFilters, debouncedSearchQuery, page]);

  // Initial load and search
  useEffect(() => {
    fetchProductsData(true);
  }, [debouncedSearchQuery, filters, fetchProductsData]);

  // Infinite scroll setup
  const lastProductCallback = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
    lastProductRef.current = node;
  }, [loading, hasMore]);

  // Load more products
  useEffect(() => {
    if (page > 1) {
      fetchProductsData();
    }
  }, [page]);

  // Update hasMore based on pagination
  useEffect(() => {
    setHasMore(page < pagination.totalPages);
  }, [page, pagination.totalPages]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    fetchProductsData(true);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      prescription: '',
      inStock: null,
      featured: false,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearching(false);
    setPage(1);
  };

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/product/${product.slug}`);
  };

  // Product card component
  const ProductCard = ({ product, isLast = false }: { product: Product; isLast?: boolean }) => (
    <div ref={isLast ? lastProductCallback : undefined}>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.profileImgUrl ? (
            <img
              src={product.profileImgUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-12 w-12" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.prescriptionRequired === 'yes' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Rx Required
              </Badge>
            )}
          </div>
          
          {/* Discount Badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              {Math.round(((product.price - product.discountPrice) /product.price) * 100)}% OFF
            </Badge>
          )}
          
          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProduct(product);
                }}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              रु{product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-sm text-gray-400 line-through">
                रु{product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {product.stock > 10 ? 'In Stock' : 
               product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
            
            <span className="text-xs text-gray-500">
              SKU: {product.sku}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const memoizedProductCards = React.useMemo(() => {
    return products.map((product, index) => (
      <ProductCard 
        key={product.id} 
        product={product}
        isLast={index === products.length - 1}
      />
    ));
  }, [products]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSearching ? `Search Results for "${searchQuery}"` : 'Shop Products'}
              </h1>
              <p className="text-gray-600">
                {isSearching 
                  ? `Found ${products.length} products` 
                  : `Showing ${products.length} of ${pagination.total} products`
                }
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={(e) => {
                      const [sortBy, order] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('order', order as 'asc' | 'desc');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                  </select>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0] || ''}
                      onChange={(e) => handleFilterChange('priceRange', [parseFloat(e.target.value) || 0, filters.priceRange[1]])}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1] || ''}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseFloat(e.target.value) || 10000])}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                {/* Prescription Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription
                  </label>
                  <select
                    value={filters.prescription}
                    onChange={(e) => handleFilterChange('prescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Products</option>
                    <option value="yes">Prescription Required</option>
                    <option value="no">No Prescription</option>
                  </select>
                </div>

                <Separator />

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={filters.inStock === null ? '' : filters.inStock ? 'true' : 'false'}
                    onChange={(e) => handleFilterChange('inStock', e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <Separator />

                {/* Featured Products */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Products Only</span>
                  </label>
                </div>

                <Separator />

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={`${filters.sortBy}-${filters.order}`}
                        onChange={(e) => {
                          const [sortBy, order] = e.target.value.split('-');
                          handleFilterChange('sortBy', sortBy);
                          handleFilterChange('order', order as 'asc' | 'desc');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="price-asc">Price Low to High</option>
                        <option value="price-desc">Price High to Low</option>
                        <option value="name-asc">Name A-Z</option>
                      </select>
                      
                      <select
                        value={filters.prescription}
                        onChange={(e) => handleFilterChange('prescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">All Products</option>
                        <option value="yes">Rx Required</option>
                        <option value="no">No Rx</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Grid */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading products. Please try again.</p>
                <Button onClick={() => fetchProductsData(true)}>Retry</Button>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {isSearching 
                    ? `No products match your search for "${searchQuery}"`
                    : 'Try adjusting your filters or search terms'
                  }
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {memoizedProductCards}
            </div>

            {/* Loading More */}
            {loading && page > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">You've reached the end of the results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 