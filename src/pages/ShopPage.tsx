import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts, searchProducts } from '../features/products/productSlice';
import type { Product, ProductFilters } from '../api/productApi';
import { useCart } from '../utils/hooks/useCart';
import {
  ShopHeader,
  DesktopFiltersSidebar,
  EmptyState,
  ProductsGrid,
} from '@/components/shop';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const { loading, pagination } = useAppSelector((state) => state.products);
  

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    prescription: 'all', // Changed from '' to 'all'
    inStock: null,
    featured: false,
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProductsData = useCallback(async (targetPage: number, replace = false) => {
    const currentFilters: ProductFilters = {
      page: targetPage,
      limit: 10,
      sortBy: filters.sortBy as ProductFilters['sortBy'],
      order: filters.order,
      prescription:
        filters.prescription === 'all'
          ? undefined
          : (filters.prescription as 'yes' | 'no' | undefined),
      inStock: filters.inStock === null ? undefined : filters.inStock,
      featured: filters.featured || undefined,
      minPrice: filters.priceRange[0] || undefined,
      maxPrice: filters.priceRange[1] || undefined,
    };

    try {
      let responseData: { products?: Product[]; pagination?: { totalPages?: number } };

      if (debouncedSearchQuery.trim()) {
        responseData = await dispatch(searchProducts({
          query: debouncedSearchQuery.trim(),
          filters: currentFilters 
        })).unwrap();
      } else {
        responseData = await dispatch(fetchProducts(currentFilters)).unwrap();
      }

      const fetchedProducts = responseData.products || [];
      const totalPages = responseData.pagination?.totalPages || 0;

      setVisibleProducts((prev) => {
        if (replace) return fetchedProducts;

        const existingIds = new Set(prev.map((product) => product.id));
        const nextProducts = fetchedProducts.filter(
          (product) => !existingIds.has(product.id)
        );
        return [...prev, ...nextProducts];
      });

      setHasMore(totalPages > 0 ? targetPage < totalPages : fetchedProducts.length === 10);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [dispatch, filters, debouncedSearchQuery]);

  // Reset pagination and list when filters/search change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setVisibleProducts([]);
  }, [debouncedSearchQuery, filters]);

  useEffect(() => {
    setIsSearching(Boolean(debouncedSearchQuery.trim()));
  }, [debouncedSearchQuery]);

  // Fetch current page data
  useEffect(() => {
    fetchProductsData(page, page === 1);
  }, [page, fetchProductsData]);

  // Infinite scroll sentinel
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || loading || !hasMore) return;
        setPage((prevPage) => prevPage + 1);
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    setDebouncedSearchQuery(searchQuery.trim());
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      prescription: 'all', // Changed from '' to 'all'
      inStock: null,
      featured: false,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearching(false);
  };

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl">
      {/* Header */}
      <ShopHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        products={visibleProducts}
        pagination={pagination}
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <DesktopFiltersSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {!loading && visibleProducts.length === 0 && (
              <EmptyState
                isSearching={isSearching}
                searchQuery={searchQuery}
                clearFilters={clearFilters}
              />
            )}

            {visibleProducts.length > 0 && (
              <ProductsGrid
                products={visibleProducts}
                hasMore={hasMore}
                handleAddToCart={handleAddToCart}
              />
            )}
            <div className="mt-6 flex justify-center">
              {loading && visibleProducts.length > 0 && (
                <p className="text-sm text-gray-600">Loading more products...</p>
              )}
            </div>
            <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
